//import necessary dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/indexStyle/index.css';
import {marked} from "marked";
import interactjs from 'interactjs';
import Prism from "prismjs";

//set initial content for markdown
const initialText = `
# Markdown Previewer!
## Happy Coding
 

Write your single line code, \`<div></div>\`, between two backticks.


**js**

\`\`\`

// Write your multi-line code between a pair of three backticks:

class App extends React.Component {
  constructor(props) {
     super(props)
  }
}

\`\`\`

[My Codepen](https://codepen.io/Kruze-Development)
> Go checkout my works!

### Why I love FCC
-  It is accessible everywhere.
- it is accessible to anyone.
- A lot of challenges to practice what you learn.
- Great community for easy.
- A lot of great tutors are ready to help.

#### Thank You
![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`;


//add markdown option 
marked.setOptions({
  breaks: true,
  highlight: function (code) {
    return Prism.highlight(code, Prism.languages.javascript, 'javascript');
  }
});


// creat root component (App)
 class App extends React.Component {

    constructor(props) {
      super(props)
    
      this.state = {
         text: initialText,
         switched: false,
      }

      this.textHandler = this.textHandler.bind(this);
      this.switchedHandler = this.switchedHandler.bind(this)
  
    }
    
//use state to control text input
    textHandler(e) {
        this.setState({
            text: e.target.value,
        })
    }

//track the switched state
    switchedHandler() {
       this.setState({
         switched: !this.state.switched,
       })
       console.log(this.state.switched)
    }

//setup interactjs for resizing in comDidMount
    componentDidMount() {
      //resize editors width
      interactjs('#editor')
      .resizable({
        // resize from all edges and corners
        edges: {  right: true },
    
        listeners: {
          move (event) {
            var target = event.target
            var x = (parseFloat(target.getAttribute('data-x')) || 0)
            var y = (parseFloat(target.getAttribute('data-y')) || 0)
    
            // update the element's style
            target.style.width = event.rect.width + 'px'
            target.style.height = event.rect.height + 'px'
    
            // translate when resizing from top or left edges
            x += event.deltaRect.left
            y += event.deltaRect.top
    
            target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
    
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
            target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
          }
        },
        modifiers: [
          // keep the edges inside the parent
          interactjs.modifiers.restrictEdges({
            outer: 'parent'
          }),
    
          // minimum size
          interactjs.modifiers.restrictSize({
            min: { width: 100 }
          })
        ],
    
        inertia: true
      })

    }
// render jsx to the ui
  render() {

    return (
      <div className="wrapper">
        <div className="switch-wrapper">
        <Switch switched = {this.state.switched} switchedHandler = {this.switchedHandler}/>
        </div>
        <div className="container">
          <Editor text = {this.state.text} textHandler = {this.textHandler} switched = {this.state.switched} />
          <Previewer text = {this.state.text}/>
        </div>
      </div>
    )
  }
};



//editor component 
 class Editor extends React.Component {
  
    
      
      render() {
        return (
          <>
            <textarea id="editor" className={this.props.switched ? "editor editor-up" : "editor"} value={this.props.text} onChange={this.props.textHandler} ></textarea>
          </>
        )
      }

};

//previewer component
 class Previewer extends React.Component {

  render() {
    return (
      <>
        <div id="preview" className="preview "
         dangerouslySetInnerHTML= {
          {
            __html: marked(this.props.text)
          }
        }/>
      
      </>
    )
  }
}


//switch component
class Switch extends React.Component {
     
     render() {
          return (
              <button className="switch" onClick={this.props.switchedHandler}><i className={this.props.switched ? "fa fa-pencil-square-o" : "fa fa-code"}></i>{this.props.switched ? "Editor" : "Preview"}</button>
          )
     }
}



//render the root component(App) to the DOM
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

