<template>
  <div class="AppTable">
    <div class="container AppTable__container">
        <el-input
          v-model="searchValue"
          style="width: 240px"
          placeholder="Поиск по таблице..."
          :prefix-icon="Search"
        />
        <el-button v-if="checkedRows.length" @click="handleClickDelete">Удалить выбранные</el-button>
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2
            v-model:sort-state="sortState"
            :columns="columns"
            :data="data"
            :width="width"
            :height="height"
            fixed
            @column-sort="onSort"
          />
        </template>
      </el-auto-resizer>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ref, unref, watch } from 'vue'
import { TableV2SortOrder, ElCheckbox } from 'element-plus'

const searchValue = ref('');

const checkedRows = ref([]);

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const SelectionCell = ({
  value,
  intermediate = false,
  onChange,
}) => {
  return (
    <ElCheckbox
      onChange={onChange}
      modelValue={value}
      indeterminate={intermediate}
    />
  )
}

const handleClickDelete = () => {
  searchValue.value = '';
  emit('update:modelValue', getSearchResult(searchValue.value, props.modelValue.filter((item) => !checkedRows.value.includes(item.query))));
  data.value = getSearchResult(searchValue.value, data.value)
};

const generateData = (
  columns,
  ipList,
) =>
  ipList.map((ip, index) => {
    return columns.reduce(
      (rowData, column) => {
        if (column.dataKey) {
          rowData[column.dataKey] = ip[column.dataKey];
        }
        return rowData
      },
      {id: `row-${index}`, checked: false, parentId: null}
    )
  })

const columns = [
  {key: 'column-0', dataKey: 'query', title: 'IP', width: 250},
  {key: 'column-1', dataKey: 'country', title: 'Country', width: 250},
  {key: 'column-2', dataKey: 'city', title: 'City/Town', width: 250},
  {key: 'column-3', dataKey: 'status', title: 'Status', width: 100},
]
columns.unshift({
  key: 'selection',
  width: 50,
  cellRenderer: ({ rowData }) => {
    const onChange = (value) => (rowData.checked = value)
    return <SelectionCell value={rowData.checked} onChange={onChange} />
  },

  headerCellRenderer: () => {
    const _data = unref(data)
    const onChange = (value) =>
      (data.value = _data.map((row) => {
        row.checked = value
        return row
      }))
    const allSelected = _data.every((row) => row.checked)
    const containsChecked = _data.some((row) => row.checked)
    checkedRows.value = _data.filter((item) => item.checked).map((item) => item.query);

    return (
      <SelectionCell
        value={allSelected}
        intermediate={containsChecked && !allSelected}
        onChange={onChange}
      />
    )
  },
})

const data = ref(generateData(columns, props.modelValue))

columns[0].sortable = true;
columns[1].sortable = true;
columns[2].sortable = true;
columns[3].sortable = true;
columns[4].sortable = true;

const sortState = ref<SortState>({
  'column-0': TableV2SortOrder.ASC,
  'column-1': TableV2SortOrder.ASC,
  'column-2': TableV2SortOrder.ASC,
  'column-3': TableV2SortOrder.ASC,
})

const onSort = ({ key, order }: SortBy) => {
  sortState.value[key] = order
  data.value = data.value.reverse()
}

const getSearchResult = (value, rows) => generateData(columns, rows).filter((item) => {
    let isExistElement = false;

    Object.values(item).forEach((field) => {
      const fieldValue = String(field).toLowerCase();

      if (fieldValue.indexOf(value.toLowerCase()) !== -1) {
        isExistElement = true;
      }
    });

    return isExistElement;
  });

watch(() => props.modelValue, (value) => data.value = value);

watch(() => searchValue.value, (value) => {
  console.log(props.modelValue)
  data.value = getSearchResult(value, props.modelValue)
});
</script>

<style>
.AppTable__container {
  height: 400px;
}
</style>