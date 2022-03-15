/* eslint-disable indent */
const { React } = require('powercord/webpack'); // We have to import React
const { TextInput } = require('powercord/components/settings'); // Here we Import the TextInput Component for later use

// This section is the Page the user sees
module.exports = class settings extends React.PureComponent {
//   constructor (props) {
//     super (props);
//   }

  render () {
    return (
      <div>
        <TextInput
          onChange={val => {
              this.props.updateSetting('whitelistedChannels', val);
              console.log(val);
              return val;
            }}
          defaultValue={this.props.getSetting('whitelistedChannels', '')}
          required={false}
          disabled={false}
          note='Disable the filters in specific channels, by their ID. Seperate them by , (for example, "755015856945102891,755015869914152981")'
         >
          Whitelisted Channels
        </TextInput>
      </div>
    );
  }
};
