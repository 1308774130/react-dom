// import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from './resetReact/react-dom'
import './index.css'

function FunctionComponent(props) {
  return (
    <div className="border">
      <p>{props.name}</p>
    </div>
  );
}
// class ClassComponent extends Component {
//   render() {
//     return (
//       <div className="border">
//         <p>{this.props.name}</p>
//       </div>
//     );
//   }
// }
ReactDOM.render(
  <div className="border">
    <h1>呜啦啦啦啦啦啦啦</h1>
    <h1>呜啦啦啦啦啦啦啦<span>9</span></h1>
    <a href="https://www.kaikeba.com/">kkb</a>
    <FunctionComponent name="函数" />
    {/* <ClassComponent name="class" /> */}
  </div>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
