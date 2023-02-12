import { useContext } from "react";
//import GameItem from "./GameItem";
import Tree from "react-d3-tree";
import LichessContext from "../../contex/lichess/LichessContext";
//import { v4 as uuidv4 } from "uuid";

const UserGames = () => {
  const { games, loading } = useContext(LichessContext);

  const splitIdNode = (node, number) => {
    let idNode = node.split(" ");
    return idNode[number];
  };

  const winRate = (white, black, draw) => {
    let totalGames = white + black + draw;
    let whiteWin = (white * 100) / totalGames;
    let blackWin = (black * 100) / totalGames;
    let draws = (draw * 100) / totalGames;
    let result =
      "White victory " +
      Math.round(whiteWin) +
      "% " +
      "Black victory " +
      Math.round(blackWin) +
      "% " +
      "Draws " +
      Math.round(draws) +
      "%";

    return result;
  };

  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps,
  }) => (
    <foreignObject {...foreignObjectProps}>
      <div
        className="dropdown dropdown-right dropdown-hover "
        onClick={toggleNode}
      >
        <label tabIndex={0} className="badge badge-sm m-1 w-12">
          {splitIdNode(nodeDatum.id, 1)}
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-72"
        >
          <li>
            <p className="text-sm">
              {winRate(
                nodeDatum.data.attributes?.white,
                nodeDatum.data.attributes?.black,
                nodeDatum.data.attributes?.draw
              )}
            </p>
          </li>
        </ul>
      </div>
    </foreignObject>
  );

  const treeData = games;
  const nodeSize = { x: 300, y: 500 };
  const separation = { siblings: 0.25, nonSiblings: 0.25 };
  const scaleExtent = { max: 2, min: 0 };
  const translate = { x: 650, y: 75 };
  const foreignObjectProps = {
    width: nodeSize.x + 75,
    height: nodeSize.y + 75,
    x: -32,
    y: -15,
  };

  if (Object.keys(treeData).length !== 0 && treeData.constructor !== Object) {
    return (
      <div
        id="treeWrapper"
        style={{ flex: "center", width: "90vw", height: "90vh" }}
      >
        <Tree
          data={treeData}
          pathFunc="elbow"
          orientation="vertical"
          zoom="1.5"
          depthFactor="50"
          //initialDepth="1"
          separation={separation}
          nodeSize={nodeSize}
          scaleExtent={scaleExtent}
          translate={translate}
          renderCustomNodeElement={(rd3tProps) =>
            renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
          }
        />
      </div>
    );
  }else{
    if(loading){
      return <h3>Loading...</h3>
    }
  }
};

export default UserGames;
