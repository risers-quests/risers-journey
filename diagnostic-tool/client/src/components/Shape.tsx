import { ShapeSpec, ShapeKind } from "../types";

const VIEWBOX = "0 0 200 160";

function shapeGeometry(shape: ShapeKind): { points: string; isCircle: boolean; labelPos: [number, number][] } {
  switch (shape) {
    case "right-triangle":
      return { points: "20,15 20,145 180,145", isCircle: false, labelPos: [[38, 40], [38, 132], [140, 132]] };
    case "rectangle":
      return {
        points: "20,30 180,30 180,130 20,130",
        isCircle: false,
        labelPos: [[100, 22], [190, 80], [100, 145], [10, 80]],
      };
    case "square":
      return {
        points: "40,20 160,20 160,140 40,140",
        isCircle: false,
        labelPos: [[100, 12], [172, 80], [100, 152], [28, 80]],
      };
    case "parallelogram":
      return {
        points: "50,30 190,30 150,130 10,130",
        isCircle: false,
        labelPos: [[120, 20], [178, 80], [80, 145], [22, 80]],
      };
    case "right-trapezium":
      // Two right angles on the left; the right side slopes (top-right obtuse, bottom-right acute).
      return { points: "20,20 140,20 180,140 20,140", isCircle: false, labelPos: [[42, 42], [128, 42], [156, 128], [42, 128]] };
    case "pentagon":
      return {
        points: "100,10 190,70 155,150 45,150 10,70",
        isCircle: false,
        labelPos: [[100, 0], [175, 62], [140, 158], [60, 158], [10, 62]],
      };
    case "circle":
      return { points: "", isCircle: true, labelPos: [[100, 80]] };
    case "triangle":
    default:
      return { points: "100,15 20,145 180,145", isCircle: false, labelPos: [[100, 34], [42, 132], [158, 132]] };
  }
}

export function Shape({ spec }: { spec: ShapeSpec }) {
  const { shape, sideLabels = [], angleLabels = [], note } = spec;
  const { points, isCircle, labelPos } = shapeGeometry(shape);

  return (
    <div className="shape-diagram">
      <svg viewBox={VIEWBOX} className="shape-svg">
        {isCircle ? <circle cx={100} cy={80} r={65} className="shape-outline" /> : <polygon points={points} className="shape-outline" />}
        {angleLabels.map((label, i) =>
          label ? (
            <text key={`angle-${i}`} x={labelPos[i]?.[0] ?? 100} y={labelPos[i]?.[1] ?? 80} className="shape-label" textAnchor="middle">
              {label}
            </text>
          ) : null
        )}
        {sideLabels.map((label, i) =>
          label ? (
            <text
              key={`side-${i}`}
              x={labelPos[i]?.[0] ?? 100}
              y={(labelPos[i]?.[1] ?? 80) + (angleLabels.length ? 16 : 0)}
              className="shape-label"
              textAnchor="middle"
            >
              {label}
            </text>
          ) : null
        )}
      </svg>
      {note && <div className="shape-note">{note}</div>}
    </div>
  );
}
