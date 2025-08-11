import cv2
from ultralytics import YOLO
from collections import defaultdict

# Инициализация модели YOLOv8 Nano
model = YOLO('yolov8n.pt')

# Словарь для хранения пересечений
crossed_objects = defaultdict(set)
vehicle_classes = {
    2: 'car', 3: 'motorcycle', 5: 'bus', 7: 'truck'
}

# Параметры линии подсчёта (координаты x1,y1,x2,y2)
# COUNT_LINE = (100, 500, 1180, 500)
COUNT_LINE = (300, 800, 1620, 800)


def is_crossing_line(box, line):
    x1, y1, x2, y2 = line
    cx = (box[0] + box[2]) // 2
    cy = (box[1] + box[3]) // 2
    return y1 - 5 <= cy <= y1 + 5 and x1 <= cx <= x2


cap = cv2.VideoCapture('input.mp4')
tracker = {}

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Детекция объектов
    results = model.track(frame, persist=True, verbose=False)
    
    for box in results[0].boxes:
        track_id = int(box.id) if box.id is not None else None
        cls = int(box.cls)
        
        if cls not in vehicle_classes:
            continue
        
        # Обновление позиций треков
        if track_id not in tracker:
            tracker[track_id] = []
        
        tracker[track_id].append(box.xyxy[0].tolist())
        
        # Проверка пересечения линии
        if is_crossing_line(box.xyxy[0], COUNT_LINE):
            crossed_objects[track_id].add(vehicle_classes[cls])

cap.release()

# Агрегация результатов
final_count = defaultdict(int)
for classes in crossed_objects.values():
    for cls in classes:
        final_count[cls] += 1

print("Результаты подсчёта:")
for vehicle, count in final_count.items():
    print(f"{vehicle}: {count}")
