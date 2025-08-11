import cv2
from ultralytics import YOLO
from collections import defaultdict
import os

def process_video(video_path):
    # Загрузка модели YOLOv8 Nano
    model = YOLO('yolov8n.pt')

    # Словарь для хранения уникальных ID транспортных средств
    vehicle_registry = defaultdict(set)

    # Открытие видео
    cap = cv2.VideoCapture(video_path)

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        # Детекция с трекингом
        results = model.track(frame, persist=True, verbose=False)

        if results[0].boxes.id is not None:
            boxes = results[0].boxes.xywh.cpu()
            track_ids = results[0].boxes.id.int().cpu().tolist()
            class_ids = results[0].boxes.cls.int().cpu().tolist()

            for box, track_id, cls_id in zip(boxes, track_ids, class_ids):
                class_name = model.names[cls_id]

                if class_name in ['car', 'truck', 'bus', 'motorcycle']:
                    # Регистрируем только новые ID
                    if track_id not in vehicle_registry[class_name]:
                        vehicle_registry[class_name].add(track_id)

    cap.release()

    # Преобразуем в итоговую статистику
    result = {k: len(v) for k, v in vehicle_registry.items()}
    return result

if __name__ == "__main__":
    video_files = ['input2.mp4']

    for video in video_files:
        if os.path.exists(video):
            counts = process_video(video)
            print(f"\nРезультаты для {video}:")
            for vehicle, count in counts.items():
                print(f"{vehicle}: {count}")
            print(f"Всего: {sum(counts.values())}")
