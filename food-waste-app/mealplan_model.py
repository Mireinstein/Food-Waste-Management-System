import os
import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    HfArgumentParser,
    TrainingArguments,
    pipeline,
    logging
)
from peft import LoraConfig, PeftModel
from trl import SFTTrainer

tokenizer = None
model = None


def load_modules():
    """
    Loads the DeepSeek model and tokenizer with 4-bit quantization settings.

    Returns:
        model: The loaded AutoModelForCausalLM model.
        tokenizer: The corresponding AutoTokenizer.
    """
    global tokenizer, model
    if model is not None and tokenizer is not None:
        return model, tokenizer

    # Model configuration parameters
    model_name = "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B"
    use_4bit = True
    bnb_4bit_compute_dtype = "float16"
    bnb_4bit_quant_type = "nf4"
    use_nested_quant = False
    device_map = "auto"  # Automatically distribute layers across GPUs

    # Compute dtype for 4-bit base models
    compute_dtype = getattr(torch, bnb_4bit_compute_dtype)

    # Set up the quantization configuration
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=use_4bit,
        bnb_4bit_quant_type=bnb_4bit_quant_type,
        bnb_4bit_compute_dtype=compute_dtype,
        bnb_4bit_use_double_quant=use_nested_quant,
    )

    # Hugging Face token
    hf_token = os.environ.get("HF_TOKEN")

    # Load the model with the quantization configuration
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        quantization_config=bnb_config,
        device_map=device_map,
        use_auth_token=hf_token  # Pass your Hugging Face token here

    )
    model.config.use_cache = False
    model.config.pretraining_tp = 1

    # Load the tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        model_name,
        trust_remote_code=True,
        use_auth_token=hf_token
    )

    return model, tokenizer


def get_outputs(model, inputs, tokenizer, max_new_tokens=2000):
    """
    Generates outputs from the model given tokenized inputs.
    """
    outputs = model.generate(
        input_ids=inputs["input_ids"],
        attention_mask=inputs["attention_mask"],
        max_new_tokens=max_new_tokens,
        repetition_penalty=1.1,
        early_stopping=True,  # Can stop before reaching the max_length
        eos_token_id=tokenizer.eos_token_id,
        pad_token_id=tokenizer.pad_token_id,
        do_sample=False
    )
    return outputs


def query_model(system, user_input, model, tokenizer, max_new_tokens=2000):
    """
    Formats the messages into a prompt, tokenizes the input, and queries the model.

    Args:
        system (str): System message for context.
        user_input (str): User-provided query text.
        model: The loaded model.
        tokenizer: The corresponding tokenizer.
        max_new_tokens (int): Maximum number of tokens to generate.

    Returns:
        The decoded output from the model.
    """
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": user_input}
    ]
    prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    model_input = tokenizer(prompt, return_tensors="pt").to("cuda")
    foundational_outputs = get_outputs(model, model_input, tokenizer, max_new_tokens=max_new_tokens)
    output = tokenizer.batch_decode(foundational_outputs, skip_special_tokens=True)
    return output


def to_str(alist):
    """
    Converts a list of strings into a single concatenated string.
    """
    return "".join(alist)


def get_plan(all_food, pref_foods, model, tokenizer, max_new_tokens=2000):
    """
    Creates a meal plan by building a prompt using the given food options,
    sending the query to DeepSeek, and returning the response.

    Args:
        all_food (list): A list of food options.
        pref_foods (list): A list of preferred food options.
        model: The loaded DeepSeek model.
        tokenizer: The corresponding tokenizer.
        max_new_tokens (int): Maximum number of tokens to generate.

    Returns:
        The response from the DeepSeek model as a list of decoded strings.
    """
    # Convert food lists to strings
    all_food_str = to_str(all_food)
    pref_foods_str = to_str(pref_foods)

    # Define available options (as a constant string)
    available_options = (
        "bananas, apples, oranges, tangerines, milk, chocolate milk, cereal, white bread, "
        "sourdough bread, ham, turkey ham, egg salad, water, orange juice, pineapple juice, "
        "lemonade, apple juice, coke, sprite, vitamin water, seltzer water"
    )

    # System message providing context for the dietary planner
    system = "You are a dietary planner for a college student based on dining hall food options."

    # Create the user input prompt using f-string formatting
    user_input = (
        f"I want you to create a meal plan, including portion size suggestions, "
        f"for me for my next meal based on the following food options: {all_food_str} and {available_options}. "
        f"Out of everything available, I prefer the following food options: {pref_foods_str}; "
        f"Please make a meal plan for each of these three meals for me to have a balanced diet. "
        f"If the diet based on my preferred food options is unbalanced, suggest other foods I should incorporate "
        f"from the available options."
    )

    # Query the model and return its output
    output = query_model(system, user_input, model, tokenizer, max_new_tokens=max_new_tokens)
    return output


def get_meal_plan(all_food, pref_foods):
    # Load the model and tokenizer
    #model, tokenizer = load_model()
    # Get the meal plan from the DeepSeek model
    plan = get_plan(all_food, pref_foods, model, tokenizer)
    return plan
