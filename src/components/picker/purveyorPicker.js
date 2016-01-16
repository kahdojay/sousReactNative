import React from 'react-native';

const {
  PickerIOS,
} = React;

class PurveyorPicker extends React.Component {

  render(){
    const {purveyors, purveyorIdList} = this.state;
    if (
      purveyorIdList[this.state.pickerIdx] !== null &&
      purveyorIdList[this.state.pickerIdx].hasOwnProperty('idx')
    ) {
      selectedValue = purveyorIdList[this.state.pickerIdx].idx;
    }
    pickerItems.push(
      <PickerIOS.Item
        key={null}
        value={null}
        label={'Select Purveyor'}
      />
    )
    // console.log(purveyors);
    purveyors.forEach((purveyor, purveyorIdx) => {
      const selectedIdx = _.findIndex(purveyorIdList, {'id': purveyor.id})
      if(selectedIdx === -1 || this.state.pickerIdx === selectedIdx){
        pickerItems.push(
          <PickerIOS.Item
            key={purveyorIdx}
            value={purveyorIdx}
            label={purveyor.name}
          />
        )
      }
    })
    return (
      <PickerIOS
        // selectedValue={selectedValue}
        selectedValue={this.state.selectedPurveyor}
        onValueChange={(purveyorIdx) => {
          // let purveyorSelected = false
          // let newPurveyorIdList = []
          // newPurveyorIdList = newPurveyorIdList.concat(purveyorIdList)
          // if(purveyorIdx === null){
          //   newPurveyorIdList = [
          //     ...newPurveyorIdList.slice(0, this.state.pickerIdx),
          //     ...newPurveyorIdList.slice(this.state.pickerIdx + 1)
          //   ]
          //   if(newPurveyorIdList.length === 0){
          //     newPurveyorIdList.push(null)
          //   }
          // } else {
            const purveyor = purveyors[purveyorIdx]
            // newPurveyorIdList[this.state.pickerIdx] = {idx: purveyorIdx, id: purveyor.id, name: purveyor.name}
            // purveyorSelected = true
          // }
          this.setState({
            selectedPurveyor: purveyor.id,
            // purveyorIdList: newPurveyorIdList,
            // purveyorSelected: purveyorSelected,
            // picker: null,
            // pickerIdx: null
          }, () => {
            // this.submitReady();
          })
        }}
      >
        {pickerItems}
      </PickerIOS>
    )
  }
};

export default PurveyorPicker;
