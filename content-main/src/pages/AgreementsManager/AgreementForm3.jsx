/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Text, Textarea,
  TextInput, Modal,
} from '@mantine/core';
import flat from 'flat';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mantine/dates';
import { formatISO, parseISO } from 'date-fns';
import { loadingStates, validateEmail } from '../../utilities/utilities';
import colors from '../../utilities/design';
import { showNotification } from '@mantine/notifications';
import Editor from '../../components/Editor';
import TemplatesList from '../../components/TemplateManager/TemplatesList';

const AgreementForm3 = ({
    id, form, setUiConfigs, uiConfigs, save,
}) => {
  const agreementFormJson = flat.unflatten(form.values);

  const navigate = useNavigate();

  const [configs, setConfigs] = useState({
    templateView: false,
    editorKey: 'key-1',
    editorContent: agreementFormJson.contractQuillJsDelta || ({
      ops: [{insert: "Agreement content goes here..."}]
    }),
  });
  const savePrev = async () => {
      await save({...form.values, formCompleted: true });
      setUiConfigs({
        ...uiConfigs,
        currentStep: 1,
      });
  };

  const saveNext = async () => {
      await save({...form.values, contractQuillJsDelta: configs.editorContent, formCompleted: true });
      navigate('/app/agreements/details/'+id)
  };

  return (<>
    {configs.templateView && <Modal
        overflow="inside"
        opened
        onClose={() => {
          setConfigs((prevState) => ({
            ...prevState,
            templateView: false
          }));
        }}
        size="calc(80vw)"
    >
      <TemplatesList showNewTemplateBtn={false} templateType="Agreements" useTemplateFunc={(template) => {
        console.log({
          template
        });
        setConfigs((prevState) => ({
          ...prevState,
          templateView: false,
          editorContent: template.quillDelta,
          editorKey: 'key-'+Math.random(),
        }));
      }} />
    </Modal>}
    <div className="w-full flex flex-col my-4">
      <div className="flex my-4 justify-end">
        <Button onClick={() => {
          setConfigs((prevState) => ({
            ...prevState,
            templateView: true,
          }))}}>
          Choose from template
        </Button>
      </div>
      <div className="flex justify-center mt-4">
      <Editor key={configs.editorKey} content={configs.editorContent} onContentChange={
        (content) => {
          setConfigs((prevState) => ({
            ...prevState,
            editorContent: content,
          }))
        }
      } />
      </div>
      <div className="flex flex-row justify-between">
        {uiConfigs.loading === loadingStates.LOADING
            ? <BeatLoader color={colors.primary} size={10} />
            : (
                <>
                  <Button className="max-w-xs mt-20" onClick={savePrev}>Previous</Button>
                  <Button className="max-w-xs mt-20" onClick={saveNext}>Finish</Button>
                </>
            )}
      </div>
    </div>
      </>
  );
};

export default AgreementForm3;
