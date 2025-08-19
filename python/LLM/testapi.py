import requests

url = "https://bothub.chat/api/v2/openai/v1/chat/completions"

headers = {
    "Authorization": "",
    "Content-Type": "application/json",
}

data = {
    "model": "gpt-oss-120b",
    "messages": [
        {"role": "system", "content": "Ты — помощник, умеющий искать информацию в интернете."},
        {"role": "user", "content": "Найди актуальные цены на iPhone 15 Pro Max в онлайне и выдай ссылки на магазины."}
    ],
    "web_access": True   # Включаем веб-поиск
}

response = requests.post(url, headers=headers, json=data)
print("Status:", response.status_code)
print("Headers:", response.headers)
print("Text:", response.text)

print(response.json())
