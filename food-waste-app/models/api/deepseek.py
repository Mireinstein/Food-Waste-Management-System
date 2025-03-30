import os
import torch
from fastapi import FastAPI
from typing import List
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig
)
from peft import LoraConfig, PeftModel
from trl import SFTTrainer

app = FastAPI()

tokenizer = None
model = None


def load_modules():
    """
    Loads the DeepSeek model and tokenizer with 4-bit quantization settings.
    """
    global model, tokenizer
    if model is not None and tokenizer is not None:
        return model, tokenizer

    model_name = "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B"
    use_4bit = True
    bnb_4bit_compute_dtype = "float16"
    bnb_4bit_quant_type = "nf4"
    use_nested_quant = False
    device_map = "auto"

    compute_dtype = getattr(torch, bnb_4bit_compute_dtype)

    bnb_config = BitsAndBytesConfig(
        load_in_4bit=use_4bit,
        bnb_4bit_quant_type=bnb_4bit_quant_type,
        bnb_4bit_compute_dtype=compute_dtype,
        bnb_4bit_use_double_quant=use_nested_quant,
    )

    hf_token = "HUGGING_FACE_TOKEN_HERE" ##########################################################################################

    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        quantization_config=bnb_config,
        device_map=device_map,
        use_auth_token=hf_token
    )
    model.config.use_cache = False
    model.config.pretraining_tp = 1

    tokenizer = AutoTokenizer.from_pretrained(
        model_name,
        trust_remote_code=True,
        use_auth_token=hf_token
    )

    return model, tokenizer

# Load model on startup
load_modules()

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
    """
    all_food_str = to_str(all_food)
    pref_foods_str = to_str(pref_foods)

    available_options = (
        "bananas, apples, oranges, tangerines, milk, chocolate milk, cereal, white bread, "
        "sourdough bread, ham, turkey ham, egg salad, water, orange juice, pineapple juice, "
        "lemonade, apple juice, coke, sprite, vitamin water, seltzer water"
    )

    system = "You are a dietary planner for a college student based on dining hall food options."

    user_input = (
        f"I want you to create a meal plan, including portion size suggestions, "
        f"for me for my next meal based on the following food options: {all_food_str} and {available_options}. "
        f"Out of everything available, I prefer the following food options: {pref_foods_str}; "
        f"Please make a meal plan for each of these three meals for me to have a balanced diet. "
        f"If the diet based on my preferred food options is unbalanced, suggest other foods I should incorporate "
        f"from the available options."
    )

    output = query_model(system, user_input, model, tokenizer, max_new_tokens=max_new_tokens)
    return output


@app.get("/api/get_meal_plan")
def get_meal_plan(all_food: List[str], pref_foods: List[str]):
    """
    API endpoint to retrieve the meal plan for the provided food lists.
    """
    plan = get_plan(all_food, pref_foods, model, tokenizer)
    return {"meal_plan": plan}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
