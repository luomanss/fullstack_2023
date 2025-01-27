import { createContext, useContext, useEffect, useState } from "react";
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from "./types";

interface NotificationContextType {
  error: string | null;
  setError: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }

  return context;
};

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ error, setError: showError }}>
      {children}
    </NotificationContext.Provider>
  );
};

const Notification = () => {
  const { error } = useNotification();

  if (!error) return null;

  return <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>;
};

interface AddDiaryEntryProps {
  addDiaryEntry: (entry: NewDiaryEntry) => void;
}

const AddDiaryEntry = (props: AddDiaryEntryProps) => {
  const [newDate, setNewDate] = useState("");
  const [newWeather, setNewWeather] = useState<Weather>(Weather.Sunny);
  const [newVisibility, setNewVisibility] = useState<Visibility>(
    Visibility.Great
  );
  const [comment, setComment] = useState("");

  const addDiaryEntry = () => {
    const newEntry = {
      date: newDate,
      weather: newWeather,
      visibility: newVisibility,
      comment: comment
    };

    props.addDiaryEntry(newEntry);
  };

  return (
    <>
      <h2>Add new entry</h2>
      <Notification />
      <div>
        <label>
          Date:
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </label>
      </div>
      <div style={{ display: "flex" }}>
        <div>Weather:</div>
        <div style={{ display: "flex" }}>
          {Object.values(Weather).map((weather) => (
            <div key={weather}>
              <input
                type="radio"
                id={`weather-${weather}`}
                name="weather"
                value={weather}
                checked={weather === newWeather}
                onChange={(e) => setNewWeather(e.target.value as Weather)}
              />
              <label htmlFor={`weather-${weather}`}>{weather}</label>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div>Visibility:</div>
        <div style={{ display: "flex" }}>
          {Object.values(Visibility).map((visibility) => (
            <div key={visibility}>
              <input
                type="radio"
                id={`visibility-${visibility}`}
                name="visibility"
                value={visibility}
                checked={visibility === newVisibility}
                onChange={(e) => setNewVisibility(e.target.value as Visibility)}
              />
              <label htmlFor={`visibility-${visibility}`}>{visibility}</label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label>
          Comment:
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
      </div>
      <button onClick={addDiaryEntry}>Add</button>
    </>
  );
};

interface DiaryEntriesProps {
  entries: DiaryEntry[];
}

const DiaryEntries = ({ entries }: DiaryEntriesProps) => {
  return (
    <div>
      <h2>Diary Entries</h2>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id} style={{ marginBottom: 10 }}>
            <div>
              <strong>{entry.date}</strong>
            </div>
            <div>
              <div>Weather: {entry.weather}</div>
              <div>Visibility: {entry.visibility}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

function Main() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const { setError } = useNotification();

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/diaries");
        const data = await response.json();
        setDiaryEntries(data);
      } catch {
        setError("Failed to fetch diary entries");
      }
    };

    fetchDiaryEntries();
  }, [setError]);

  const addDiaryEntry = (entry: NewDiaryEntry) => {
    const postDiaryEntry = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/diaries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entry),
        });

        
        if (response.ok) {
          const data = await response.json();
          
          setDiaryEntries(diaryEntries.concat(data));
        } else {
          const error = await response.text();

          setError(error);
        }
      } catch(e) {
        console.error(e);
        setError("Error: Failed to add diary entry");
      }
    };

    postDiaryEntry();
  };

  return (
    <div>
      <AddDiaryEntry addDiaryEntry={addDiaryEntry} />
      <DiaryEntries entries={diaryEntries} />
    </div>
  );
}

const App = () => {
  return (
    <NotificationProvider>
      <Main />
    </NotificationProvider>
  );
};

export default App;
