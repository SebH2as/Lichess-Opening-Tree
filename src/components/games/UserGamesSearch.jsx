import { useState, useContext } from "react";
import LichessContext from "../../contex/lichess/LichessContext";
import AlertContext from "../../contex/alert/AlertContext";

const UserGamesSearch = () => {
  const [text, setText] = useState("");

  const { games, stream, readStream, onMessage, onComplete, clearUserGames } =
    useContext(LichessContext);

  const { setAlert } = useContext(AlertContext);
  
  const handleChange = (e) => setText(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text === "") {
      setAlert('Please enter a player name', 'error')
    } else {
      stream(text).then(readStream(onMessage)).then(onComplete);
      
    }
  };

  const handleClearGames = () => {
    clearUserGames()
    setText('')
  }

  return (
    <div className="grid grid-cols-2">
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <div className="relative">
              <input
                type="text"
                className="w-full pr-40 bg-gray-200 input input-lg text-black"
                placeholder="Enter a player name"
                value={text}
                onChange={handleChange}
              />
              <button
                type="submit"
                className="absolute top-0 right-0 rounded-l-none w-36 btn btn-lg"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
      {Object.keys(games).length != 0 && (
        <div>
          <button onClick={handleClearGames} className="btn btn-ghost btn-lg">
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default UserGamesSearch;
