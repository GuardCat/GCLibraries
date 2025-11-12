# Установка: pip install "unstructured[pptx,pdf]"
# + предварительная установка CPU-версии torch

import argparse
import os
import sys

from langchain_community.document_loaders import UnstructuredPowerPointLoader, UnstructuredPDFLoader
from markdownify import markdownify as md

def debug_documents(documents, target_page):
    """
    Выводит детальную информацию обо всех элементах на указанной странице
    для диагностики.
    """
    print(f"\n--- DEBUG: Анализ элементов на странице {target_page} ---")
    found_page = False
    for doc in documents:
        page_num = doc.metadata.get('page_number')
        if page_num == target_page:
            found_page = True
            category = doc.metadata.get('category', 'N/A')
            element_id = doc.metadata.get('element_id', 'N/A')
            content_preview = doc.page_content.strip().replace('\n', ' ')
            print(f"  [Категория: {category}] [ID: {element_id}]")
            print(f"    -> {content_preview[:150]}...")
            print("-" * 20)
    
    if not found_page:
        print(f"Страница {target_page} не найдена.")
    print("--- Конец отладки ---\n")


def format_docs_for_rag(documents, file_type_name):
    """
    Преобразует список документов, надежно обрабатывая все типы текста.
    """
    pages_content = {}
    for doc in documents:
        page_num = doc.metadata.get('page_number', 1)
        if page_num not in pages_content:
            pages_content[page_num] = {
                "title": "",
                "content": [],
                "tables": []
            }
        
        category = doc.metadata.get('category', '')
        text = doc.page_content.strip()
        
        # Пропускаем пустые элементы, чтобы не засорять результат
        if not text:
            continue

        # Явно обрабатываем только заголовки и таблицы
        if category == 'Title':
            pages_content[page_num]["title"] = text
        elif category == 'Table':
            # Логика для конвертации таблиц из HTML в Markdown
            html_table = doc.metadata.get('text_as_html')
            if html_table:
                md_table = md(html_table, tables=['table'])
                pages_content[page_num]["tables"].append(md_table)
            else:
                pages_content[page_num]["tables"].append(text)
        else:
            # ИЗМЕНЕНИЕ: Все остальные категории (NarrativeText, ListItem, 
            # UncategorizedText, Caption и т.д.) считаем общим содержимым.
            # Это гарантирует, что никакой текст не будет потерян.
            pages_content[page_num]["content"].append(text)

    # Собираем финальный текст
    final_text = []
    for page_num in sorted(pages_content.keys()):
        page_data = pages_content[page_num]
        
        final_text.append(f"=== {file_type_name} {page_num} ===")
        
        if page_data["title"]:
            final_text.append(f"ЗАГОЛОВОК: {page_data['title']}")
        
        if page_data["content"]:
            final_text.append("СОДЕРЖАНИЕ:\n" + "\n".join(page_data['content']))
            
        if page_data["tables"]:
            final_text.append("ТАБЛИЦА:\n" + "\n".join(page_data['tables']))
        
        final_text.append("\n")
        
    return "\n".join(final_text)

# --- Основной блок выполнения ---
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Конвертирует PPTX/PDF в текст, исправляя потерю элементов на сложных слайдах."
    )
    parser.add_argument(
        "file_path", 
        type=str, 
        help="Путь к файлу для конвертации (например, 'my_presentation.pptx')."
    )
    parser.add_argument(
        "--debug", 
        action="store_true",
        help="Запустить в режиме отладки, чтобы показать все извлеченные элементы для страницы."
    )
    parser.add_argument(
        "--page", 
        type=int, 
        default=1,
        help="Номер страницы для анализа в режиме отладки (по умолчанию: 1)."
    )
    
    args = parser.parse_args()
    file_path = args.file_path

    if not os.path.exists(file_path):
        print(f"Ошибка: Файл не найден по пути '{file_path}'")
        sys.exit(1)

    if file_path.lower().endswith(".pptx"):
        loader = UnstructuredPowerPointLoader(file_path, mode="elements")
        file_type_name = "СЛАЙД"
    elif file_path.lower().endswith(".pdf"):
        loader = UnstructuredPDFLoader(file_path, mode="elements")
        file_type_name = "СТРАНИЦА"
    else:
        print("Ошибка: Неподдерживаемый формат файла. Используйте .pptx или .pdf")
        sys.exit(1)

    print(f"Загрузка файла: {file_path}...")
    documents = loader.load()
    
    if args.debug:
        # Запускаем режим отладки и выходим
        debug_documents(documents, args.page)
        sys.exit(0)

    print("Обработка и форматирование содержимого...")
    formatted_rag_text = format_docs_for_rag(documents, file_type_name)

    output_filename = os.path.splitext(file_path)[0] + "_for_rag.txt"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(formatted_rag_text)

    print(f"Готово! Файл '{output_filename}' успешно создан.")
