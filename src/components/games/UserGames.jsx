import { useContext } from "react";
//import GameItem from "./GameItem";
import Tree from 'react-d3-tree';
import LichessContext from "../../contex/lichess/LichessContext";
//import { v4 as uuidv4 } from "uuid";

const UserGames = () => {
  const { games, loading } = useContext(LichessContext);

  const splitIdNode = (node) => {
    let idNode = node.split(' ');
    return idNode[1]
  }

  const winRate = (white, black, draw) => {
    let totalGames = white + black + draw ;
    let whiteWin = (white*100)/ totalGames;
    let blackWin = (black*100)/ totalGames;
    let draws = (draw*100)/ totalGames;
    let result= "White victory " + Math.round(whiteWin) + '% ' + "Black victory " + Math.round(blackWin) + '% ' + "Draws " + Math.round(draws) + '%'

    return result
  }

  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps
  }) => (
    <g>
      <circle r={15} {...foreignObjectProps}></circle>
      <foreignObject {...foreignObjectProps}>
        <h4 style={{ textAlign: "center" }} onClick={toggleNode}>
          {splitIdNode(nodeDatum.id)}       
        </h4>
        <span style={{ fontSize: "10px", paddingLeft: "90px"}}>
          {winRate(nodeDatum.data.attributes?.white, nodeDatum.data.attributes?.black, nodeDatum.data.attributes?.draw)}
        </span>
      </foreignObject>
      
      {/* `foreignObject` requires width & height to be explicitly set.
      <foreignObject {...foreignObjectProps}>
        <div style={{ border: "1px solid black", backgroundColor: "black" }}>
          <h3 style={{ textAlign: "center" }}>{nodeDatum.name}</h3>
          {nodeDatum.children && (
            <button style={{ width: "100%" }} onClick={toggleNode}>
              {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
            </button>
          )}
        </div>
      </foreignObject> */}
    </g>
  );
  
  const treeData = games;
  const nodeSize = { x: 50, y: 50 };
  const scaleExtent = { max: 2, min: 0 }
  const translate = { x:650 , y:50}
  const foreignObjectProps = { width: 400, height: 50, x: -200, y:-15 };
  
  if (Object.keys(treeData).length !== 0 && treeData.constructor !== Object) {

    return (<div id="treeWrapper" style={{ flex: 'center', width: '90vw', height: '90vh' }}>
      <Tree data={treeData}
      pathFunc="step"
      orientation="vertical" 
      zoom="1.5"
      depthFactor="50"
      //initialDepth="1"
      nodeSize={nodeSize} 
      scaleExtent={scaleExtent} 
      translate={translate} 
      renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
        }
        />
    </div>)
    
  }

  
      
     


    
  
  
};

export default UserGames;
