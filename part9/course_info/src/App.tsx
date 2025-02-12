interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background";
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;

interface HeaderProps {
  courseName: string;
}

const Header = (props: HeaderProps) => {
  return <h1>{props.courseName}</h1>;
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface PartProps {
  part: CoursePart;
}

const Part = (props: PartProps) => {
  switch (props.part.kind) {
    case "basic":
      return (
        <p>
          <div>
            <strong>
              {props.part.name} {props.part.exerciseCount}
            </strong>
          </div>
          <div>
            <i>{props.part.description}</i>
          </div>
        </p>
      );
    case "group":
      return (
        <p>
          <div>
            <strong>
              {props.part.name} {props.part.exerciseCount}
            </strong>
          </div>
          <div>project exercises {props.part.exerciseCount}</div>
        </p>
      );
    case "background":
      return (
        <p>
          <div>
            <strong>
              {props.part.name} {props.part.exerciseCount}
            </strong>
          </div>
          <div>
            <i>{props.part.description}</i>
          </div>
          <div>
            <a href={props.part.backgroundMaterial}>
              {props.part.backgroundMaterial}
            </a>
          </div>
        </p>
      );
    default:
      return assertNever(props.part);
  }
};

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = (props: ContentProps) => {
  return (
    <>
      {props.courseParts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </>
  );
};

interface TotalProps {
  totalExercises: number;
}

const Total = (props: TotalProps) => {
  return <p>Number of exercises {props.totalExercises}</p>;
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group",
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial:
        "https://type-level-typescript.com/template-literal-types",
      kind: "background",
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
  ];

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  );

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;
