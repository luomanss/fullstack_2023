const Header = ({ course }) => {
    return <h2>{course.name}</h2>;
  };
  
  const Part = ({ part }) => {
    return (
      <p>
        {part.name} {part.exercises}
      </p>
    );
  };
  
  const Content = ({ parts }) => {
    return (
      <>
        {parts.map((part) => (
          <Part key={part.id} part={part} />
        ))}
      </>
    );
  };
  
  const Total = ({ parts }) => {
    return (
      <p>
        <b>
          total of exercises{" "}
          {parts.reduce((acc, part) => acc + part.exercises, 0)}
        </b>
      </p>
    );
  };
  
  export const Course = ({ course }) => {
    return (
      <>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </>
    );
  };