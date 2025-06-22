import clip
import torch
import json
import sys

def load_model():
    model, preprocess = clip.load("ViT-B/32", device="cpu")
    return model, preprocess

def encode_text(model, text):
    tokenized_text = clip.tokenize([text])
    with torch.no_grad():
        text_features = model.encode_text(tokenized_text)
    return text_features.cpu().numpy().tolist()

if __name__ == "__main__":
    operation = sys.argv[1]
    text = sys.argv[2]

    model, preprocess = load_model()

    if operation == "encode":
        features = encode_text(model, text)
        print(json.dumps(features))
