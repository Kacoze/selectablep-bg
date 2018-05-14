import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import styles from './style.scss';

const initialState = {
  suggestions: [],
};

class App extends Component {
  state = {
    ...initialState,
    background: '#000000',
    colors: [],
    inputValue: '',
  };

  componentDidMount() {
    fetch('http://www.mocky.io/v2/5a37a7403200000f10eb6a2d')
      .then(res => res.json())
      .then(colors => this.setState({ colors }))
      .catch(err => console.log(err));
  }

  handleInputValue = ({ target: { value } }) => {
    const { colors } = this.state;
    if (value.length > 1) {
      const regex = new RegExp(value);
      const suggestions = [];
      colors.forEach((i) => {
        if (regex.test(i.name)) {
          suggestions.push({ ...i, bold: i.name.replace(value, `<b>${value}</b>`) });
        }
      });
      this.setState({ suggestions, inputValue: value });
    } else {
      this.setState({ ...initialState });
    }
  }

  handleColorPick = (background) => {
    const input = this.colorInput;
    if (input) {
      input.value = background;
    }
    this.setState({ inputValue: background });
  }

  handleColorAccept = (color) => {
    const { colors, inputValue } = this.state;
    const picked = colors.filter(i => i.name === inputValue)[0];
    if (picked || color) {
      this.setState({ background: picked ? picked.hex : color });
    }
  }

  convertHex = (hex, opacity) => {
    const nhex = hex.replace('#', '');
    const r = parseInt(nhex.substring(0, 2), 16);
    const g = parseInt(nhex.substring(2, 4), 16);
    const b = parseInt(nhex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity / 100})`;
  }

  render() {
    const { background, suggestions } = this.state;
    const bg = { background: this.convertHex(background, 50) };
    return (
      <div style={bg} className={styles.container}>
        <div className={styles.autoselect}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              className={styles.autoselectInput}
              onChange={this.handleInputValue}
              // eslint-disable-next-line
              ref={i => this.colorInput = i}
            />
            <ul className={styles.options}>
              {suggestions.map(i => (
                <li key={`${i.name}${Math.random()}`}>
                  <button
                    className={styles.suggestion}
                    // eslint-disable-next-line
                    dangerouslySetInnerHTML={{ __html: i.bold }}
                    onClick={() => this.handleColorPick(i.name)}
                  />
                </li>
              ))}
            </ul>
          </div>
          <button className={styles.applyBtn} onClick={this.handleColorAccept}>Apply</button>
        </div>
      </div>
    );
  }
}

export default App;
