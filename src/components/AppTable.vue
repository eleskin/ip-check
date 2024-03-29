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
import { TableV2SortOrder, ElButton, ElCheckbox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const searchValue = ref('')

const checkedRows = ref([])

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const hidden = defineModel('hidden');

const SelectionCell = ({
  value,
  intermediate = false,
  onChange
}: {
  value: string
  intermediate: boolean
  onChange: () => void
}) => {
  return <ElCheckbox onChange={onChange} modelValue={value} indeterminate={intermediate} />
}

const handleClickDelete = () => {
  searchValue.value = ''
  emit(
    'update:modelValue',
    getSearchResult(
      searchValue.value,
      props.modelValue.filter((item: any) => !checkedRows.value.includes(item.query))
    )
  )
  data.value = getSearchResult(searchValue.value, data.value)
  hidden.value = true;
}

const generateData = (columns: any, ipList: any) =>
  ipList.map((ip: string, index: number) => {
    return columns.reduce(
      (rowData: any, column: any) => {
        if (column.dataKey) {
          rowData[column.dataKey] = ip[column.dataKey]
        }
        return rowData
      },
      { id: `row-${index}`, checked: false, parentId: null }
    )
  })

const handleCopyData = (ip: string) => {
  navigator.clipboard.writeText(ip).then(
    () => {
      console.log('Текст успешно скопирован в буфер обмена')
    },
    (err) => {
      console.error('Произошла ошибка при копировании текста: ', err)
    }
  )
}

const handleDelete = (ip: string) => {
  checkedRows.value = [ip]
  handleClickDelete()
  checkedRows.value = []
}

const columns = [
  {
    key: 'column-0',
    dataKey: 'query',
    title: 'IP',
    width: 350,
    cellRenderer: (props: any) => {
      return (
        <div className="AppTable__cell">
          <div>
            <span class={`fi fi-${props.rowData.countryCode.toLowerCase()}`}></span>
            <span>{props.rowData.query}</span>
          </div>
          <div>
            <ElButton
              size="small"
              type="secondary"
              onClick={() => handleCopyData(props.rowData.query)}
            >
              <el-icon size="size" color="color">
                <CopyDocument />
              </el-icon>
            </ElButton>
            <ElButton size="small" type="danger">
              <el-icon size="size" color="color">
                <Delete onClick={() => handleDelete(props.rowData.query)} />
              </el-icon>
            </ElButton>
          </div>
        </div>
      )
    }
  },
  { key: 'column-1', dataKey: 'country', title: 'Country', width: 250 },
  { key: 'column-2', dataKey: 'city', title: 'City/Town', width: 250 },
  {
    key: 'column-3',
    dataKey: 'status',
    title: 'Status',
    width: 100,
    cellRenderer: (props: any) => {
      return (
        <div>
          {props.rowData.status === 'success' ? (
            <img src="/src/assets/icons/check.svg" />
          ) : props.rowData.status === 'fail' ? (
            <img src="/src/assets/icons/times.svg" />
          ) : (
            <img src="/src/assets/icons/sync.svg" />
          )}
        </div>
      )
    }
  },
  { key: 'column-4', dataKey: 'countryCode', title: 'Country code', hidden: true }
]
columns.unshift({
  key: 'selection',
  width: 50,
  cellRenderer: ({ rowData }) => {
    const onChange = (value: boolean) => (rowData.checked = value)
    return <SelectionCell value={rowData.checked} onChange={onChange} />
  },

  headerCellRenderer: () => {
    const _data = unref(data)
    const onChange = (value: boolean) =>
      (data.value = _data.map((row: any) => {
        row.checked = value
        return row
      }))
    const allSelected = _data.every((row: any) => row.checked)
    const containsChecked = _data.some((row: any) => row.checked)
    checkedRows.value = _data.filter((item: any) => item.checked).map((item: any) => item.query)

    return (
      <SelectionCell
        value={allSelected}
        intermediate={containsChecked && !allSelected}
        onChange={onChange}
      />
    )
  }
})

const data = ref(generateData(columns, props.modelValue))

columns[1].sortable = true
columns[2].sortable = true
columns[3].sortable = true
columns[4].sortable = true

const sortState = ref({
  'column-0': TableV2SortOrder.ASC,
  'column-1': TableV2SortOrder.ASC,
  'column-2': TableV2SortOrder.ASC,
  'column-3': TableV2SortOrder.ASC
})

const onSort = ({ key, order }) => {
  sortState.value[key] = order
  data.value = data.value.reverse()
}

const getSearchResult = (value: string, rows: any) =>
  generateData(columns, rows).filter((item) => {
    let isExistElement = false

    Object.values(item).forEach((field) => {
      const fieldValue = String(field).toLowerCase()

      if (fieldValue.indexOf(value.toLowerCase()) !== -1) {
        isExistElement = true
      }
    })

    return isExistElement
  })

watch(
  () => props.modelValue,
  (value) => (data.value = value)
)

watch(
  () => searchValue.value,
  (value) => {
    console.log(props.modelValue)
    data.value = getSearchResult(value, props.modelValue)
  }
)
</script>

<style>
.AppTable__container {
  height: 400px;
}

.AppTable__cell {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.AppTable__cell div {
  display: flex;
  justify-content: space-between;
  grid-column-gap: 4px;
  align-items: center;
}
</style>
