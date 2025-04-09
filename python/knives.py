import math

def calculate_angle(thickness, height):
    ratio = thickness / height
    angle_rad = math.asin(ratio)
    # Переводим радианы в градусы
    angle_deg = math.degrees(angle_rad)
    return angle_deg

thickness, height = (float(i) for i in input("Введите толщину обуха и высоту черeз пробел: ").split())
print(thickness, height)
angle = calculate_angle(thickness, height)

print(f"Угол заточки: {angle:.2f}°")
