# Установка: pip install "unstructured[pptx,pdf]"
# + предварительная установка CPU-версии torch

from langchain_community.document_loaders import UnstructuredPowerPointLoader, UnstructuredPDFLoader
import os

def format_docs_for_rag(documents):
    """
    Преобразует список документов из UnstructuredLoader
    в единый, хорошо структурированный текст для заливки в Open Web UI.
    """
    # Группируем элементы по номеру слайда/страницы
    pages_content = {}
    for doc in documents:
        page_num = doc.metadata.get('page_number', 1)
        if page_num not in pages_content:
            pages_content[page_num] = {
                "title": "",
                "content": [],
                "notes": "",
                "tables": []
            }
        
        category = doc.metadata.get('category', '')
        text = doc.page_content.strip()
        
        if category == 'Title':
            pages_content[page_num]["title"] = text
        elif category in ['NarrativeText', 'ListItem']:
            pages_content[page_num]["content"].append(text)
        elif category == 'Table':
            pages_content[page_num]["tables"].append(text)
        elif category == 'UncategorizedText': # Часто это заметки
            if text and not pages_content[page_num]["notes"]:
                pages_content[page_num]["notes"] = text

    # Собираем финальный текст
    final_text = []
    for page_num in sorted(pages_content.keys()):
        page_data = pages_content[page_num]
        
        page_type = "СЛАЙД" if "pptx" in file_path else "СТРАНИЦА"
        final_text.append(f"=== {page_type} {page_num} ===")
        
        if page_data["title"]:
            final_text.append(f"ЗАГОЛОВОК: {page_data['title']}")
        
        if page_data["content"]:
            final_text.append("СОДЕРЖАНИЕ:\n" + "\n".join(page_data['content']))
            
        if page_data["tables"]:
            final_text.append("ТАБЛИЦА:\n" + "\n".join(page_data['tables']))

        if page_data["notes"]:
            final_text.append(f"ЗАМЕТКИ СПИКЕРА:\n{page_data['notes']}")
        
        final_text.append("\n")
        
    return "\n".join(final_text)

# --- Использование ---
file_path = "document.PPTX" # или "my_document.pdf"

if file_path.lower().endswith(".pptx"):
    loader = UnstructuredPowerPointLoader(file_path, mode="elements")
elif file_path.lower().endswith(".pdf"):
    loader = UnstructuredPDFLoader(file_path, mode="elements")
else:
    raise ValueError("Неподдерживаемый формат файла")

documents = loader.load()
formatted_rag_text = format_docs_for_rag(documents)

output_filename = os.path.splitext(file_path)[0] + "_for_rag.txt"
with open(output_filename, "w", encoding="utf-8") as f:
    f.write(formatted_rag_text)

print(f"Файл '{output_filename}' успешно создан с помощью CPU-версии unstructured.")
