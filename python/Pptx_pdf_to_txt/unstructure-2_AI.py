# Установка: pip install "unstructured[pptx,pdf]" markdownify langchain_community
# + предварительная установка CPU-версии torch

import argparse # Импортируем модуль для работы с аргументами
import os
import sys

from langchain_community.document_loaders import UnstructuredPowerPointLoader, UnstructuredPDFLoader
from markdownify import markdownify as md

def format_docs_for_rag(documents, file_type_name):
    """
    Преобразует список документов из UnstructuredLoader
    в единый, хорошо структурированный текст, включая таблицы в формате Markdown.
    """
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
            # Логика для конвертации таблиц из HTML в Markdown
            html_table = doc.metadata.get('text_as_html')
            
            if html_table:
                md_table = md(html_table, tables=['table'])
                pages_content[page_num]["tables"].append(md_table)
            else:
                pages_content[page_num]["tables"].append(text)
        elif category == 'UncategorizedText':
            if text and not pages_content[page_num]["notes"]:
                pages_content[page_num]["notes"] = text

    # Собираем финальный текст
    final_text = []
    for page_num in sorted(pages_content.keys()):
        page_data = pages_content[page_num]
        
        # Используем переданный тип файла для заголовка
        final_text.append(f"=== {file_type_name} {page_num} ===")
        
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

# --- Основной блок выполнения ---
if __name__ == "__main__":
    # 1. Настраиваем парсер аргументов командной строки
    parser = argparse.ArgumentParser(
        description="Конвертирует презентации (PPTX) или документы (PDF) в текстовый формат для RAG, преобразуя таблицы в Markdown."
    )
    parser.add_argument(
        "file_path", 
        type=str, 
        help="Путь к файлу для конвертации (например, 'my_presentation.pptx' или 'my_document.pdf')."
    )
    
    # 2. Получаем аргументы из командной строки
    args = parser.parse_args()
    file_path = args.file_path

    # 3. Проверяем, существует ли файл
    if not os.path.exists(file_path):
        print(f"Ошибка: Файл не найден по пути '{file_path}'")
        sys.exit(1) # Выходим с кодом ошибки

    # 4. Определяем тип файла и создаем соответствующий загрузчик
    if file_path.lower().endswith(".pptx"):
        loader = UnstructuredPowerPointLoader(file_path, mode="elements")
        file_type_name = "СЛАЙД"
    elif file_path.lower().endswith(".pdf"):
        loader = UnstructuredPDFLoader(file_path, mode="elements")
        file_type_name = "СТРАНИЦА"
    else:
        print("Ошибка: Неподдерживаемый формат файла. Используйте .pptx или .pdf")
        sys.exit(1)

    # 5. Обрабатываем файл
    print(f"Загрузка файла: {file_path}...")
    documents = loader.load()
    
    print("Обработка и форматирование содержимого...")
    formatted_rag_text = format_docs_for_rag(documents, file_type_name)

    output_filename = os.path.splitext(file_path)[0] + "_for_rag.txt"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(formatted_rag_text)

    print(f"Готово! Файл '{output_filename}' успешно создан с таблицами в формате Markdown.")

