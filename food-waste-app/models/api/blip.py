from fastapi import FastAPI, UploadFile, File, Form
from typing import Optional
import torch
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration, AutoTokenizer, AutoModelForCausalLM

app = FastAPI()

# Load BLIP-2 Processor and Model for Image Captioning
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
caption_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to(
    "cuda" if torch.cuda.is_available() else "cpu"
)

# Load Falcon-7B for Text Processing
# llm_model_name = "tiiuae/falcon-7b-instruct"
# tokenizer = AutoTokenizer.from_pretrained(llm_model_name)
# text_model = AutoModelForCausalLM.from_pretrained(llm_model_name).to("cuda" if torch.cuda.is_available() else "cpu")


@app.post("api/post_left_over/")
async def generate_caption(file: UploadFile = File(...)):
    """Generate a detailed caption for an uploaded image."""
    image = Image.open(file.file).convert("RGB")
    inputs = processor(images=image, text="On this plate, there is ", return_tensors="pt").to(caption_model.device)
    caption_ids = caption_model.generate(**inputs, min_length=32, max_length=64, num_beams=5, early_stopping=True)
    caption = processor.batch_decode(caption_ids, skip_special_tokens=True)[0]

    return {"caption": caption}


# @app.post("api/ask-question/")
# async def ask_image_question(file: UploadFile = File(...), question: str = Form(...)):
#     """Answer a specific question about the uploaded image."""
#     image = Image.open(file.file).convert("RGB")
#     inputs = processor(images=image, text=question, return_tensors="pt").to(caption_model.device)
#     answer_ids = caption_model.generate(**inputs, max_length=100, num_beams=5, early_stopping=True)
#     answer = processor.batch_decode(answer_ids, skip_special_tokens=True)[0]
#
#     return {"question": question, "answer": answer}


# @app.post("api/process-text/")
# async def process_text(text: str = Form(...)):
#     """Process text using Falcon-7B LLM."""
#     inputs = tokenizer(text, return_tensors="pt").to(text_model.device)
#     output = text_model.generate(**inputs, max_length=200)
#     processed_text = tokenizer.decode(output[0], skip_special_tokens=True)
#
#     return {"input_text": text, "processed_text": processed_text}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
