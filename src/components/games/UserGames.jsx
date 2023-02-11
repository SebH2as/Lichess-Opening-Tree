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
    let result= "White victory " + Math.round(whiteWin) +"% "
    + "Black victory " + Math.round(blackWin) + '% ' 
    + "Draws " + Math.round(draws) + '%'

    return result
  }

  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps
  }) => (
    
      // <g>
      //   <circle r={15 } {...foreignObjectProps}></circle>
      //   <foreignObject {...foreignObjectProps}>
      //     <div className="dropdown dropdown-hover">
      //       <h4 style={{ textAlign: "center" }} onClick={toggleNode}>
      //         {splitIdNode(nodeDatum.id)}       
      //       </h4>
      //     </div>
      //     <span className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52" style={{ fontSize: "10px", paddingLeft: "90px"}}>
      //       {winRate(nodeDatum.data.attributes?.white, nodeDatum.data.attributes?.black, nodeDatum.data.attributes?.draw)}
      //     </span>
          
      //   </foreignObject>
        
        
      
      // </g>
    
    
    <>
    {/* `foreignObject` requires width & height to be explicitly set. */}
    <foreignObject {...foreignObjectProps}>
    <div className="dropdown dropdown-right dropdown-hover z-0" onClick={toggleNode}>
      <label tabIndex={0} className="btn m-1 w-12 h-2 text-sm z-0">{splitIdNode(nodeDatum.id)}</label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-72 z-100">
        <li  z-100>{winRate(nodeDatum.data.attributes?.white, nodeDatum.data.attributes?.black, nodeDatum.data.attributes?.draw)}</li>
      </ul>
    </div>
    </foreignObject>
  </>
 );

 
  
  const treeData = games;
  const nodeSize = { x: 300, y: 500 };
  const separation = { siblings: 0.25, nonSiblings: 0.25 };
  const scaleExtent = { max: 2, min: 0 }
  const translate = { x:650 , y:75}
  const foreignObjectProps = { width: nodeSize.x + 75, height: nodeSize.y +50, x: -32 , y: -32 };
  
  if (Object.keys(treeData).length !== 0 && treeData.constructor !== Object) {

    return (<div id="treeWrapper" style={{ flex: 'center', width: '90vw', height: '90vh' }}>
      <Tree data={treeData}
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
    </div>)
    
  }

  
      
     


    
  
  
};

export default UserGames;
