import React from 'react';
import { ActionIcon, Select, Text } from '@mantine/core';
import { SortAscending } from 'tabler-icons-react';

const CaseFilterSortBar = ({ configs, setConfigs }) => {
  const filterSelectValue = `${configs.filterKey}-=-${configs.filterValue}`;
  const onValueChange = (name) => (incoming) => {
    const value = incoming.target ? incoming.target.value : incoming;
    setConfigs({
      ...configs,
      [name]: value,
    });
  };
  // useEffect(() => {
  //   onFilterSortChange({
  //     sortDirection: configs.sortDirection,
  //     sortBy: configs.sortBy,
  //   });
  // }, [configs.sortDirection, configs.sortBy]);
  const filterData = [
    { label: 'Criminal Cases', value: 'caseNumber.type-=-Criminal', filterType: 'exactValueMatch' },
    { label: 'Civil Cases', value: 'caseNumber.type-=-Civil', filterType: 'exactValueMatch' },
    { label: 'IPR Cases', value: 'caseNumber.type-=-IPR', filterType: 'exactValueMatch' },
  ];
  return (
    <div className="flex flex-row justify-between w-full my-4">
      <div className="flex flex-row items-center">
        <Text size="sm" className="mx-2">Sort By :</Text>
        <Select
          value={configs.sortBy}
          data={[
            { label: 'Next Date', value: 'courtDetails.nextDate' },
            { label: 'Case Year', value: 'caseNumber.year' },
          ]}
          onChange={onValueChange('sortBy')}
        />
        <ActionIcon
          style={{
            transition: 'transform 0.2s',
            transform: configs.sortDirection === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)',
          }}
          className="ml-2"
          color="black"
          variant="hover"
          onClick={(e) => {
            e.stopPropagation();
            onValueChange('sortDirection')(configs.sortDirection === 'asc' ? 'desc' : 'asc');
          }}
        >
          <SortAscending />
        </ActionIcon>
      </div>
      <div className="flex flex-row items-center">
        <Text size="sm" className="mx-2">Filter :</Text>
        <Select
          value={filterSelectValue}
          data={filterData}
          onChange={(incoming) => {
            const value = incoming.target ? incoming.target.value : incoming;
            const selected = (filterData.filter((item) => item.value === value))[0];
            const splitted = value.split('-=-');
            setConfigs({
              ...configs,
              filterKey: splitted[0],
              filterValue: splitted[1],
              filterType: selected.filterType,
            });
          }}
        />
      </div>
    </div>
  );
};
export default CaseFilterSortBar;
