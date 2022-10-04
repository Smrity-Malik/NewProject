/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  SegmentedControl, Pagination, Select, Skeleton, Text, Modal, Button,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
// import data from './agreementData.json';
import { useNavigate } from 'react-router-dom';
import TemplateRow from './TemplateRow';
import {
  formatDate, formatTime, getValueForInput, loadingStates,
} from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import colors from '../../utilities/design';
import Editor from '../Editor';
import styles from './TemplateRow.module.css';

import { templatesDetailsApi, templatesListApi } from '../../utilities/apis/templates';

function TemplatesList({ useTemplateFunc, templateType = 'Notices', showNewTemplateBtn = true }) {
  const [templatesConfig, setTemplatesConfig] = useState({
    loading: loadingStates.LOADING,
    templates: null,
    page: 1,
    templatesCount: null,
    templateType,
    templateCategory: 'All',
    templateCategoriesList: ['All'],
    templateToView: null,
    templateToViewData: null,
    templateToViewLoading: loadingStates.NO_ACTIVE_REQUEST,
  });

  const getTemplateDetails = async (templateId) => {
    setTemplatesConfig((prevState) => ({
      ...prevState,
      templateToViewLoading: loadingStates.LOADING,
      templateToViewData: null,
    }));
    const response = await apiWrapWithErrorWithData(
      templatesDetailsApi({
        templateId,
      }),
    );
    if (response?.success && response?.template) {
      setTemplatesConfig({
        ...templatesConfig,
        templateToViewLoading: loadingStates.NO_ACTIVE_REQUEST,
        templateToViewData: response.template,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Templates Details',
        message: 'Failed to load template details.',
      });
      setTemplatesConfig({
        ...templatesConfig,
        templateToViewLoading: loadingStates.NO_ACTIVE_REQUEST,
      });
    }
  };

  const getTemplatesList = async () => {
    setTemplatesConfig((prevState) => ({
      ...prevState,
      loading: loadingStates.LOADING,
      templatesCount: null,
    }));
    const response = await apiWrapWithErrorWithData(
      templatesListApi({
        page: templatesConfig.page,
        type: templatesConfig.templateType,
        category: templatesConfig.templateCategory.toLowerCase() === 'all' ? null : templatesConfig.templateCategory,
      }),
    );
    if (response?.success && response?.templates) {
      setTemplatesConfig({
        ...templatesConfig,
        templates: response.templates,
        loading: loadingStates.NO_ACTIVE_REQUEST,
        templatesCount: response.templatesCount || null,
        templateCategoriesList: ['All', ...response.templateCategories.map(
          (template) => template.category,
        )],
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Templates List',
        message: 'Failed to load templates list',
      });
      setTemplatesConfig({
        ...templatesConfig,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    }
  };
  useEffect(() => {
    getTemplatesList();
  }, [templatesConfig.page, templatesConfig.templateCategory, templatesConfig.templateType]);

  useEffect(() => {
    if (templatesConfig.templateToView?.id) {
      getTemplateDetails(templatesConfig.templateToView.id);
    }
  }, [templatesConfig.templateToView]);

  const viewHandler = (template) => {
    setTemplatesConfig((prevState) => ({
      ...prevState,
      templateToView: template,
    }));
  };

  const templateDetails = templatesConfig.templateToViewData;

  const navigate = useNavigate();

  const useTemplateHandler = useTemplateFunc ? () => {
    setTemplatesConfig((prevState) => ({
      ...prevState,
      templateToView: null,
      templateToViewData: null,
    }));
    useTemplateFunc(templatesConfig.templateToViewData);
  } : null;

  return (
    <>
      {templatesConfig.templateToView
                && (
                <Modal
                  overflow="inside"
                  opened
                  onClose={() => {
                    setTemplatesConfig((prevState) => ({
                      ...prevState,
                      templateToView: null,
                      templateToViewQuillDelta: null,
                    }));
                  }}
                  size="calc(60vw)"
                >
                    {templatesConfig.templateToViewLoading === loadingStates.LOADING
                    && <BeatLoader color={colors.primary} size={10} />}
                    {(templatesConfig.templateToViewLoading !== loadingStates.LOADING
                            && (!!templateDetails))
                        && (
                        <div className="flex flex-col">
                          <div className="flex flex-row text-center my-2 justify-between pr-3">
                            <div className="flex">
                              <img src="/assets/images/downloadFileLogo.svg" alt="fileLogo" />
                              <div className="flex flex-col pl-3">
                                <div className={`flex justify-start ${styles.agreementTitle}`}>{templateDetails.name}</div>
                                <div className="flex flex-row text-center ">
                                  <div className={`${styles.text} mr-3`}>
                                    Created by
                                    {' '}
                                    { templateDetails.createdBy.name }
                                  </div>
                                  <div className="flex flex-row text-center">
                                    <div><img src="/assets/images/clock2.svg" alt="clock" /></div>
                                    <div className={`${styles.date} ml-2`}>
                                      {formatDate(templateDetails.createdAt)}
                                      ,
                                      {formatTime(templateDetails.createdAt)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Text>{templateDetails.category}</Text>
                          </div>
                          {!!(useTemplateHandler)
                              && (
                              <div className="flex my-2 ">
                                <Button onClick={useTemplateHandler}>
                                  Use this template
                                </Button>
                              </div>
                              )}
                          <Editor
                            locked
                            showToolBar={false}
                            content={templatesConfig.templateToViewData.quillDelta}
                          />
                        </div>
                        )}
                </Modal>
                )}
      <div className="flex flex-col pt-8 pb-14 pl-6 pr-16">
        <div className={styles.title}>Templates</div>
        <div className="flex flex-row justify-between mt-6">
          <div className={`${styles.text} mt-1`}>
            Templates can either be for agreements or notices, further you can select a category for
            template.
          </div>
          <SegmentedControl
            disabled={templatesConfig.loading === loadingStates.LOADING}
            color="blue"
            data={[
              { label: 'Notices', value: 'Notices' },
              { label: 'Agreements', value: 'Agreements' },
            ]}
            value={templatesConfig.templateType}
            onChange={(input) => {
              const val = getValueForInput(input);
              setTemplatesConfig((prevState) => ({
                ...prevState,
                templateType: val,
              }));
            }}
          />
        </div>
        <div className="flex justify-between my-4 items-center">
          <Select
            disabled={templatesConfig.loading === loadingStates.LOADING}
            className="mt-4 w-80"
            label="Category"
            data={templatesConfig.templateCategoriesList}
            value={templatesConfig.templateCategory || 'All'}
            onChange={(input) => {
              const val = getValueForInput(input);
              setTemplatesConfig((prevState) => ({
                ...prevState,
                templateCategory: val,
              }));
            }}
          />
          {showNewTemplateBtn
              && (
              <Button onClick={() => {
                navigate('/app/templates/new');
              }}
              >
                New Template
              </Button>
              )}
        </div>
        <div className="mt-16">
          {templatesConfig.loading === loadingStates.LOADING && (
            <div className="flex flex-col">
              <Skeleton height={40} className="mb-11" />
              <Skeleton height={40} className="mb-11" />
              <Skeleton height={40} className="mb-11" />
              <Skeleton height={40} className="mb-11" />
              <Skeleton height={40} className="mb-11" />
            </div>
          )}
          {templatesConfig.loading !== loadingStates.LOADING
                        && templatesConfig.templates.map((template) => (
                          <TemplateRow
                            onViewClick={() => viewHandler(template)}
                            {...template}
                          />
                        ))}
          {templatesConfig.templates?.length === 0 && (
            <div className="my-4 flex justify-center">
              <Text>No templates</Text>
            </div>
          )}
        </div>
        {templatesConfig.templatesCount
                    && (
                    <div className="flex justify-center mt-8">
                      <Pagination
                                // total={3}
                        size="sm"
                        onChange={(page) => {
                          setTemplatesConfig({
                            ...templatesConfig,
                            page,
                          });
                        }}
                        total={Math.ceil(templatesConfig.templatesCount / 10)}
                        page={templatesConfig.page}
                      />
                    </div>
                    )}
      </div>
    </>
  );
}

export default TemplatesList;
