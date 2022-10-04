import React, { useEffect, useState } from 'react';
import {
  TextInput, Button, Badge, Text, SegmentedControl, Select, Skeleton,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
// import { useLocation } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';
import { formatDistanceStrict } from 'date-fns';
import { BeatLoader } from 'react-spinners';
import { CloudUpload } from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { getValueForInput, loadingStates, existsAndLength } from '../../utilities/utilities';
import colors from '../../utilities/design';
// import { loadingStates } from '../../utilities/utilities';
import styles from './TemplateForm.module.css';
import Editor from '../Editor';
// import { updateNotice } from '../../utilities/apis/notices';
import { getPreviewUrl } from '../../utilities/apis/agreements';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { addTemplate, templatesListApi } from '../../utilities/apis/templates';

function TemplateForm() {
  // const { state } = useLocation();
  const [input, setInput] = useState({
    type: 'Notices',
    templateName: '',
    templateCategory: '',

  });

  const changeHandler = (name) => (inputValue) => {
    const value = getValueForInput(inputValue);
    setInput((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const [uiConfigs, setUiConfigs] = useState({
    templateCategories: [],
    loading: loadingStates.NO_ACTIVE_REQUEST,
    // activeTab: 'notice',
    loadingContract: loadingStates.NO_ACTIVE_REQUEST,
    previewPdfLoading: loadingStates.NO_ACTIVE_REQUEST,
    lastSaved: new Date(),
    lastSavedText: formatDistanceStrict(new Date(), new Date(), {
      addSuffix: true,
    }),
    emailBoxView: false,
    // errors: { templateName: 'please enter name' },
    errors: { },
  });

  const [contractHtml, setContractHtml] = useState('content');
  const [debouncedContractHtml] = useDebouncedValue(contractHtml || 'content', 1000, {
    leading: true,
  });

  const validate = () => {
    const keys = {};
    if (!existsAndLength(input.templateName)) {
      keys.templateName = 'Please check value.';
    }
    if (!existsAndLength(input.templateCategory)) {
      keys.templateCategory = 'Please check value.';
    }

    if (Object.keys(keys).length) {
      showNotification({
        color: 'red',
        title: 'Template Form',
        message: 'Make sure all fields are filled properly.',
      });
      setUiConfigs((data) => ({
        ...data,
        errors: keys,
      }));
      return false;
    }
    return true;
  };

  const getTemplatesList = async () => {
    setUiConfigs((prevState) => ({
      ...prevState,
      loadingCategories: loadingStates.LOADING,
    }));
    const response = await apiWrapWithErrorWithData(
      templatesListApi({}),
    );
    if (response?.success && response?.templateCategories) {
      setUiConfigs({
        ...uiConfigs,
        loadingCategories: loadingStates.NO_ACTIVE_REQUEST,
        templateCategories: response.templateCategories.map(
          (template) => template.category,
        ),
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Templates Categories',
        message: 'Failed to load templates categories',
      });
      setUiConfigs({
        ...uiConfigs,
        loadingCategories: loadingStates.NO_ACTIVE_REQUEST,
      });
    }
  };

  const navigate = useNavigate();

  const addTemplateHandler = async () => {
    if (validate()) {
      setUiConfigs((data) => ({
        ...data,
        errors: {},
        loading: loadingStates.LOADING,
      }));
      const response = await apiWrapWithErrorWithData(
        addTemplate({
          type: input.type,
          name: input.templateName,
          category: input.templateCategory,
          html: contractHtml,
        }),
      );
      if (response?.success && response?.template) {
        setUiConfigs((data) => ({
          ...data,
          loading: loadingStates.NO_ACTIVE_REQUEST,
        }));
        showNotification({
          color: 'green',
          title: 'Template Created.',
          message: 'Template has been created.',
        });
        navigate('/app/templates');
        // onModalExit();
      } else {
        showNotification({
          color: 'red',
          title: 'Template Record',
          message: 'Template could not be created.',
        });
        setUiConfigs((data) => ({
          ...data,
          loading: loadingStates.NO_ACTIVE_REQUEST,
        }));
      }
    }
  };

  useEffect(() => {
    getTemplatesList();
  }, []);

  // const [configs, setConfigs] = useState({
  //   noticeDetails: null,
  // });

  const openPreviewUrl = async () => {
    setUiConfigs({ ...uiConfigs, previewPdfLoading: loadingStates.LOADING });
    const { url } = await getPreviewUrl(contractHtml).catch(() => {
      showNotification({
        color: 'red',
        message: 'Could not load preview.',
        title: 'PDF Preview',
      });
      setUiConfigs({
        ...uiConfigs,
        previewPdfLoading: loadingStates.NO_ACTIVE_REQUEST,
      });
    });
    if (url && url.length) {
      window.open(url, '_blank').focus();
    } else {
      showNotification({
        color: 'red',
        message: 'Could not load preview.',
        title: 'PDF Preview',
      });
    }
    setUiConfigs({
      ...uiConfigs,
      previewPdfLoading: loadingStates.NO_ACTIVE_REQUEST,
    });
  };

  useEffect(() => {
    let interval = null;
    if (uiConfigs.activeTab === 'notice') {
      interval = setInterval(() => {
        setUiConfigs((stateC) => ({
          ...stateC,
          lastSavedText: formatDistanceStrict(stateC.lastSaved, new Date(), {
            addSuffix: true,
          }),
        }));
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [uiConfigs.activeTab]);

  useEffect(() => {
    // saveNoticeContract(debouncedContractHtml);
  }, [debouncedContractHtml]);

  return (
    <div className="flex flex-col pt-12 px-16">
      <div className="flex justify-end">
        <SegmentedControl
          color="blue"
          data={[
            { label: 'Notices', value: 'Notices' },
            { label: 'Agreements', value: 'Agreements' },
          ]}
          value={input.type}
          onChange={changeHandler('type')}
        />
      </div>
      <TextInput
        className={`${styles.input} mt-4`}
        label="Name of Template"
        placeholder="Enter name for template"
        value={input.templateName}
        onChange={changeHandler('templateName')}
        error={uiConfigs.errors.templateName}
      />
      {uiConfigs.loadingCategories === loadingStates.LOADING
          && <Skeleton height={65} className="mt-6" />}
      {uiConfigs.loadingCategories === loadingStates.NO_ACTIVE_REQUEST
          && (
          <Select
            creatable
            searchable
            getCreateLabel={(query) => <Text color="green">{`+ ${query}`}</Text>}
            data={uiConfigs.templateCategories}
            className={`${styles.input} mt-6`}
            placeholder="Select or type a category"
            label="Template Category"
            value={input.templateCategory}
            onCreate={(query) => {
              setUiConfigs((prevState) => ({
                ...prevState,
                templateCategories: [...prevState.templateCategories, query],
              }));
            }}
            onChange={changeHandler('templateCategory')}
            error={uiConfigs.errors.templateCategory}
          />
          )}

      <div className={`${styles.title} mt-14`}>Curate template document</div>
      <div className={`${styles.text} mt-2`}>
        Commodo eget a et dignissim dignissim morbi vitae, mi. Mi aliquam sit
        ultrices enim cursus. Leo sapien.
      </div>
      <div className="flex flex-row justify-end m-4">
        {uiConfigs.loadingContract === loadingStates.LOADING && (
          <Badge size="xl" color="green">
            <div className="flex items-center">
              <CloudUpload size={20} />
              <Text className="ml-2 lowercase">Saving...</Text>
            </div>
          </Badge>
        )}
        {/* {uiConfigs.loadingContract === loadingStates.NO_ACTIVE_REQUEST */}
        {/*  && uiConfigs.lastSaved && ( */}
        {/*    <Badge size="xl" color="green"> */}
        {/*      <div className="flex items-center"> */}
        {/*        <Check size={20} /> */}
        {/*        <Text className="ml-2 lowercase"> */}
        {/*          Last saved */}
        {/*          {` ${uiConfigs.lastSavedText}`} */}
        {/*        </Text> */}
        {/*      </div> */}
        {/*    </Badge> */}
        {/* )} */}
        <div className="flex">
          {uiConfigs.loadingContract !== loadingStates.LOADING && (
            <>
              <Button
                color="cyan"
                onClick={() => {
                  // saveNoticeContract(contractHtml);
                  addTemplateHandler();
                }}
                disabled={uiConfigs.loading === loadingStates.LOADING}
                className="w-40 mx-4"
              >
                {uiConfigs.loading === loadingStates.LOADING
              && <BeatLoader color={colors.primary} size={10} />}
                {uiConfigs.loading === loadingStates.NO_ACTIVE_REQUEST
              && <span>Save</span>}
                {/* <Text>Save</Text> */}
              </Button>
              <Button
                color="gray"
                onClick={openPreviewUrl}
                disabled={uiConfigs.previewPdfLoading === loadingStates.LOADING}
                className="w-60 mx-4"
              >
                {uiConfigs.previewPdfLoading === loadingStates.LOADING ? (
                  <BeatLoader size={10} color={colors.primary} />
                ) : (
                  <Text>Open in new tab</Text>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
      {debouncedContractHtml ? (
        <div className="flex flex-col items-center">
          <Editor
            content={debouncedContractHtml}
            onContentChange={setContractHtml}
          />
        </div>
      ) : null}
    </div>
  );
}

export default TemplateForm;
