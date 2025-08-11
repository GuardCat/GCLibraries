import cv2
from ultralytics import YOLO
from collections import defaultdict
import os

def process_video_with_debug(video_path, output_path, conf_threshold=0.5):
    model = YOLO('yolov8n.pt')
    vehicle_registry = defaultdict(set)

    cap = cv2.VideoCapture(video_path)
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        results = model.track(
            frame,
            persist=True,
            verbose=False,
            conf=conf_threshold,
            classes=[2, 3, 5, 7]  # car, motorcycle, bus, truck
        )

        if results[0].boxes.id is not None:
            boxes = results[0].boxes.xyxy.cpu()
            confs = results[0].boxes.conf.cpu()
            track_ids = results[0].boxes.id.int().cpu().tolist()
            class_ids = results[0].boxes.cls.int().cpu().tolist()

            for box, conf, track_id, cls_id in zip(boxes, confs, track_ids, class_ids):
                class_name = model.names[cls_id]

                # Регистрация новых объектов
                if track_id not in vehicle_registry[class_name]:
                    vehicle_registry[class_name].add(track_id)

                # Визуализация (постоянная подсветка)
                x1, y1, x2, y2 = map(int, box)
                color = (0, 255, 0)  # Зеленый цвет для всех объектов
                thickness = 2

                cv2.rectangle(frame, (x1, y1), (x2, y2), color, thickness)
                cv2.putText(frame,
                            f"{class_name} {track_id} ({conf:.2f})",
                            (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.6,
                            color,
                            2)

        # Отображение счётчика
        cv2.putText(frame,
                    f"Total: {sum(len(v) for v in vehicle_registry.values())}",
                    (20, 50),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (255, 255, 255),
                    2)

        out.write(frame)

    cap.release()
    out.release()
    return {k: len(v) for k, v in vehicle_registry.items()}

if __name__ == "__main__":
    videos = ['input.mp4']
    outputs = ['output_debug.mp4']

    for input_video, output_video in zip(videos, outputs):
        if os.path.exists(input_video):
            counts = process_video_with_debug(input_video, output_video)
            print(f"\nАнализ {input_video}:")
            for vehicle, count in counts.items():
                print(f"{vehicle}: {count}")
            print(f"Всего транспортных средств: {sum(counts.values())}\n")
