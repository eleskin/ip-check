<template>
  <div class="AppTable">
    <div class="container AppTable__container">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2
            :columns="columns"
            :data="data"
            :width="width"
            :height="height"
            fixed
          />
        </template>
      </el-auto-resizer>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ref, unref, watch, computed } from 'vue'
import { ElCheckbox } from 'element-plus'

import type { FunctionalComponent } from 'vue'
import type { CheckboxValueType, Column } from 'element-plus'

type SelectionCellProps = {
  value: boolean
  intermediate?: boolean
  onChange: (value: CheckboxValueType) => void
}

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const SelectionCell: FunctionalComponent<SelectionCellProps> = ({
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

const generateData = (
  columns: ReturnType<typeof columns>,
  ipList,
) =>
  ipList.map((ip, index) => {
    return columns.reduce(
      (rowData, column) => {
        rowData[column.dataKey] = ip.data[column.dataKey];
        return rowData
      },
      {id: `row-${index}`, checked: false, parentId: null}
    )
  })

const columns: Column<any>[] = [
  {key: `column-0`, dataKey: 'query', title: `IP`, width: 150},
  {key: `column-1`, dataKey: 'country', title: `Country`, width: 150},
  {key: `column-2`, dataKey: 'city', title: `City/Town`, width: 150},
  {key: `column-3`, dataKey: 'status', title: ``, width: 150},
]
columns.unshift({
  key: 'selection',
  width: 50,
  cellRenderer: ({ rowData }) => {
    const onChange = (value: CheckboxValueType) => (rowData.checked = value)
    return <SelectionCell value={rowData.checked} onChange={onChange} />
  },

  headerCellRenderer: () => {
    const _data = unref(data)
    const onChange = (value: CheckboxValueType) =>
      (data.value = _data.map((row) => {
        row.checked = value
        return row
      }))
    const allSelected = _data.every((row) => row.checked)
    const containsChecked = _data.some((row) => row.checked)

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

watch(() => props.modelValue, (value) => {
  data.value = generateData(columns, value)
});
</script>

<style>
.AppTable__container {
  height: 400px;
}
</style>