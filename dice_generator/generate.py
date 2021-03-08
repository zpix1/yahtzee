import svgwrite

size = 300

r = size / 10
r2 = size / 40

dwg = svgwrite.Drawing('.svg', profile='tiny')

base = [dwg.rect((0, 0), (size, size),rx=r, ry=r, stroke="black", fill="white")]

base_used = [
    dwg.rect((0, 0), (size, size), rx=r, ry=r, fill=svgwrite.rgb(62,172,186)),
    dwg.rect((r2, r2), (size-2*r2, size-2*r2), rx=r, ry=r, fill="white")
]

left_top = dwg.circle((size / 5, size / 5), r, stroke="black")
left_bottom = dwg.circle((size / 5, size / 5 * 4), r, stroke="black")
right_top = dwg.circle((size / 5 * 4, size / 5), r, stroke="black")
right_bottom = dwg.circle((size / 5 * 4, size / 5 * 4), r, stroke="black")

center = dwg.circle((size / 2, size / 2), r, stroke="black")

left_center = dwg.circle((size / 5, size / 2), r, stroke="black")

right_center = dwg.circle((size / 5 * 4, size / 2), r, stroke="black")

types = [
    [],
    [center],
    [left_top, right_bottom],
    [left_top, right_bottom, center],
    [left_top, right_top, left_bottom, right_bottom],
    [left_top, right_top, left_bottom, right_bottom, center],
    [left_top, right_top, left_bottom, right_bottom, left_center, right_center]
]

for i,t in enumerate(types):
    dwg = svgwrite.Drawing(str(i) + '.svg', profile='tiny')
    for dr in base:
        dwg.add(dr)
    for dr in t:
        dwg.add(dr)
    dwg.save()

    dwg = svgwrite.Drawing(str(i) + '_u' + '.svg', profile='tiny')
    for dr in base_used:
        dwg.add(dr)
    for dr in t:
        dwg.add(dr)
    dwg.save()
