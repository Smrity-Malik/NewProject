import { useState } from 'react';
import { addressDefaultData } from '../utilities/utilities';

const useMultiAddress = (dataToLoad = [], runOnSave) => {
  let initialData = [{
    data: {
      ...addressDefaultData,
    },
    mode: 'edit',
  }];

  if (dataToLoad.length) {
    initialData = (dataToLoad.map((v) => ({
      data: v,
      mode: 'view',
    })));
  }

  const [multiData, setMultiData] = useState(initialData);
  // useEffect(() => {
  //   if (dataToLoad.length) {
  //     setMultiData(dataToLoad.map((v) => ({ data: v, mode: 'view' })));
  //   }
  // }, []);
  const add = () => {
    setMultiData([...multiData, (
      {
        data: { ...addressDefaultData },
        mode: 'edit',
      }
    )]);
  };
  const removeAtIndex = (indexToDelete) => {
    setMultiData(multiData.filter(
      (data, index) => index !== indexToDelete,
    ));
  };

  const setMode = (index) => (mode) => {
    const existingData = [...multiData];
    existingData[index].mode = mode;
    setMultiData(existingData);
  };

  const onSave = (index) => (data) => {
    const existingData = [...multiData];
    existingData[index].data = data;
    setMultiData(existingData);
    runOnSave(existingData.map((node) => node.data));
  };

  const onDelete = (index) => () => removeAtIndex(index);

  const getMode = (index) => () => multiData[index].mode;

  const editOrAddAllowedCalculator = () => {
    const editModes = multiData.filter((data) => data.mode === 'edit');
    return editModes.length === 0;
  };

  const editOrAddAllowed = editOrAddAllowedCalculator();

  const deleteAllowed = multiData.length > 1;

  const data = multiData.map((node) => node.data);
  return [data, add, setMode, onSave, onDelete, editOrAddAllowed, deleteAllowed, getMode];
};

export default useMultiAddress;
