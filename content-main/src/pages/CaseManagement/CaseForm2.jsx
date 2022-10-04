import React from 'react';
import {
  Button, Grid,
  Select,
  TextInput,
} from '@mantine/core';
// import flat from 'flat';
import { showNotification } from '@mantine/notifications';
import { DatePicker } from '@mantine/dates';
import { formatISO, parseISO } from 'date-fns';
import { BeatLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { existsAndLength, loadingStates } from '../../utilities/utilities';
import colors from '../../utilities/design';
import { putSettingsInFirebaseDb } from '../../utilities/apis/settings';
import { selectWorkspaceSettings } from '../../redux/selectors';

const CaseForm2 = ({
  caseForm, setUiConfigs, uiConfigs, saveCase,
}) => {
  const validate = () => {
    const keys = {};
    if (!existsAndLength(caseForm.values['courtDetails.courtType'])) {
      keys['courtDetails.courtType'] = 'Please check value.';
    }
    if (!existsAndLength(caseForm.values['courtDetails.state'])) {
      keys['courtDetails.state'] = 'Please check value.';
    }
    if (!existsAndLength(caseForm.values['courtDetails.city'])) {
      keys['courtDetails.city'] = 'Please check value.';
    }

    if (!existsAndLength(caseForm.values['courtDetails.judgeName'])) {
      keys['courtDetails.judgeName'] = 'Please check value.';
    }

    // eslint-disable-next-line no-restricted-globals
    if (!caseForm.values['courtDetails.nextDate'] || isNaN(parseISO(caseForm.values['courtDetails.nextDate']).getTime())) {
      keys['courtDetails.nextDate'] = 'Please check value.';
    }

    if (Object.keys(keys).length > 0) {
      caseForm.setErrors(keys);
      showNotification(({
        color: 'red',
        title: 'Case Form',
        message: 'Please check all fields are filled properly.',
      }));
      return false;
    }
    return true;
  };
  const saveNext = async () => {
    if (validate() && await saveCase()) {
      setUiConfigs({
        ...uiConfigs,
        currentStep: 2,
      });
    }
  };
  const savePrev = async () => {
    if (validate() && await saveCase()) {
      setUiConfigs({
        ...uiConfigs,
        currentStep: 0,
      });
    }
  };
  // const [stateData, setStateData] = useState([]);
  // const [cityData, setCityData] = useState([]);
  // const [courtTypeData, setCourtTypeData] = useState([]);
  const workspaceSettings = useSelector(selectWorkspaceSettings);
  const { courtTypes } = workspaceSettings;
  const { statesForCase } = workspaceSettings;
  const { citiesForCase } = workspaceSettings;
  return (
    <div className="w-full flex flex-col my-4">
      <Grid>
        <Grid.Col span={4}>
          <Select
            label="Court Type"
            data={courtTypes || []}
            placeholder="Type or select"
            nothingFound="Nothing found"
            searchable
            creatable
            getCreateLabel={(query) => `+ ${query}`}
            onCreate={(query) => {
              const newSettings = {
                ...workspaceSettings,
                courtTypes: [...(courtTypes || []), {
                  label: query,
                  value: query,
                }],
              };
              putSettingsInFirebaseDb({ settingsData: newSettings });
            }}
            {...caseForm.getInputProps('courtDetails.courtType')}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            label="State"
            data={statesForCase || []}
            placeholder="Type or select"
            nothingFound="Nothing found"
            searchable
            creatable
            getCreateLabel={(query) => `+ ${query}`}
            onCreate={(query) => {
              const newSettings = {
                ...workspaceSettings,
                statesForCase: [...(statesForCase || []), {
                  label: query,
                  value: query,
                }],
              };
              putSettingsInFirebaseDb({ settingsData: newSettings });
            }}
            {...caseForm.getInputProps('courtDetails.state')}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            label="City/District"
            data={citiesForCase || []}
            placeholder="Type or select"
            nothingFound="Nothing found"
            searchable
            creatable
            getCreateLabel={(query) => `+ ${query}`}
            onCreate={(query) => {
              const newSettings = {
                ...workspaceSettings,
                citiesForCase: [...(citiesForCase || []), {
                  label: query,
                  value: query,
                }],
              };
              putSettingsInFirebaseDb({ settingsData: newSettings });
            }}
            {...caseForm.getInputProps('courtDetails.city')}
          />
        </Grid.Col>
      </Grid>
      <Grid className="my-8">
        <Grid.Col span={6}>
          <DatePicker
            minDate={new Date()}
            className="max-w-lg my-2"
            label="Next date of hearing"
            placeholder="Select date"
            {...({
              ...caseForm.getInputProps('courtDetails.nextDate'),
              onChange: (val) => {
                if (val && val.getTime) {
                  caseForm.getInputProps('courtDetails.nextDate').onChange(
                    formatISO(val),
                  );
                } else {
                  caseForm.getInputProps('courtDetails.nextDate').onChange(
                    null,
                  );
                }
              },
              value:
          caseForm.values['courtDetails.nextDate']
            ? parseISO(caseForm.values['courtDetails.nextDate']) : null,
            })}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            className="max-w-lg my-2"
            label="Name of judge"
            placeholder="Full name of judge"
            {...caseForm.getInputProps('courtDetails.judgeName')}
          />
        </Grid.Col>
      </Grid>
      <div className="flex flex-row justify-between">
        {uiConfigs.loading === loadingStates.LOADING
          ? <BeatLoader color={colors.primary} size={10} />
          : (
            <>
              <Button className="max-w-xs mt-20" onClick={savePrev}>Previous</Button>
              <Button className="max-w-xs mt-20" onClick={saveNext}>Next</Button>
            </>
          )}
      </div>
    </div>
  );
};

export default CaseForm2;
