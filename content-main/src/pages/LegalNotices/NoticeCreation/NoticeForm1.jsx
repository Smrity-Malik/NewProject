import flat from 'flat';
import { Button, Text } from '@mantine/core';
import React from 'react';
import { BeatLoader } from 'react-spinners';
import useMultiAddress from '../../../hooks/useMultiAddress';
import CompleteAddress from '../../../components/CompleteAddress';
import { loadingStates } from '../../../utilities/utilities';
import colors from '../../../utilities/design';

const NoticeForm1 = ({
  noticeForm, uiConfigs, setUiConfigs, saveNotice,
}) => {
  const noticeFormUnflatted = flat.unflatten(noticeForm.values);

  const runOnSaveReceivers = (data) => {
    noticeForm.setValues({
      ...noticeForm.values,
      ...(flat({ receivers: data })),
    });
  };

  const runOnSaveSenders = (data) => {
    noticeForm.setValues({
      ...noticeForm.values,
      ...(flat({ senders: data })),
    });
  };

  const [multiData, add, setMode,
    onSave, onDelete, editOrAddAllowed,
    deleteAllowed, getMode] = useMultiAddress(noticeFormUnflatted.receivers, runOnSaveReceivers);

  const [multiDataSenders, addSenders, setModeSenders,
    onSaveSenders, onDeleteSenders, editOrAddAllowedSenders,
    deleteAllowedSenders, getModeSenders] = useMultiAddress(
    noticeFormUnflatted.senders, runOnSaveSenders,
  );

  const saveNext = async () => {
    await saveNotice();
    setUiConfigs((stateC) => ({
      ...stateC,
      currentStep: 1,
    }));
  };

  return (
    <div className="flex flex-col py-4 px-2">

      <div className="border-solid border-2 border-gray-100 rounded-xl p-6 flex-col mx-2">
        <Text size="xl" className="my-2">Receivers</Text>
        {multiData.map(
          (dataNode, index) => (
            <CompleteAddress
              withDivider={index !== (multiData.length - 1)}
              data={dataNode}
              onDelete={onDelete(index)}
              setMode={setMode(index)}
              onSave={onSave(index)}
              allowEdit={editOrAddAllowed}
              placeholderText={`Complainant ${index + 1}`}
              deleteAllowed={deleteAllowed}
              mode={getMode(index)()}
            />
          ),
        )}
        {editOrAddAllowed
                && <Button variant="outline" className="w-60" onClick={add}>Add New Receiver</Button>}
      </div>

      <div className="border-solid border-2 border-gray-100 rounded-xl p-6 flex-col mx-2 my-4">
        <Text size="xl" className="my-2">Senders</Text>
        {multiDataSenders.map(
          (dataNode, index) => (
            <CompleteAddress
              withDivider={index !== (multiDataSenders.length - 1)}
              data={dataNode}
              onDelete={onDeleteSenders(index)}
              setMode={setModeSenders(index)}
              onSave={onSaveSenders(index)}
              allowEdit={editOrAddAllowedSenders}
              placeholderText={`Complainant ${index + 1}`}
              deleteAllowed={deleteAllowedSenders}
              mode={getModeSenders(index)()}
            />
          ),
        )}
        {editOrAddAllowed
                && <Button variant="outline" className="w-60" onClick={addSenders}>Add New Sender</Button>}
      </div>

      <div className="flex flex-row justify-between">
        <div />
        {(editOrAddAllowed && editOrAddAllowedSenders)
            && (
            <div>
              {uiConfigs.loading === loadingStates.LOADING
                ? <BeatLoader color={colors.primary} size={10} />
                : <Button className="max-w-xs mt-20" onClick={saveNext}>Next</Button>}
            </div>
            )}
      </div>

    </div>
  );
};

export default NoticeForm1;
