import UserGames from "../components/games/UserGames"
import UserGamesSearch from "../components/games/UserGamesSearch"

const Home = () => {
  return (
    <>
      <UserGamesSearch />
      <UserGames />
    </>
  )
}

export default Home