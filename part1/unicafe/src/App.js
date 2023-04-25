import { useState } from "react";

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>;

const StatisticsLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;

  return all === 0 ? (
    <p>No feedback given</p>
  ) : (
    <table>
      <tbody>
        {[
          ["good", good],
          ["neutral", neutral],
          ["bad", bad],
          ["all", all],
          ["average", ((good - bad) / all).toFixed(2)],
          ["positive", `${((good / all) * 100).toFixed(2)} %`],
        ].map((row) => (
          <StatisticsLine key={row[0]} text={row[0]} value={row[1]} />
        ))}
      </tbody>
    </table>
  );
};

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" onClick={() => setGood(good + 1)} />
      <Button text="neutral" onClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" onClick={() => setBad(bad + 1)} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
