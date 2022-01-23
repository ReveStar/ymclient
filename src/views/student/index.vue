<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.student" placeholder="学生" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.subject_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.student }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总课时" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.course_all }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余课时" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.course_left }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已用课时" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.course_used }}</span>
        </template>
      </el-table-column>
      <el-table-column label="赠送课时" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.course_free }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总费用" width="150px">
        <template slot-scope="{row}">
          <span> {{ row.charge_all }} </span>
        </template>
      </el-table-column>
      <el-table-column label="已交费用" width="150px">
        <template slot-scope="{row}">
          <span> {{ row.charge_deli }} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handlePaginate" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="课程名" prop="subject_name">
          <el-input v-model="temp.subject_id" />
        </el-form-item>
        <el-form-item label="学生" prop="student">
          <el-input v-model="temp.student" />
        </el-form-item>
        <el-form-item label="总课时" prop="course_all">
          <el-input v-model.number="temp.course_all" type="number" />
        </el-form-item>
        <el-form-item label="剩余课时" prop="course_left">
          <el-input v-model.number="temp.course_left" type="number" />
        </el-form-item>
        <el-form-item label="已用课时" prop="course_used">
          <el-input v-model.number="temp.course_used" type="number" />
        </el-form-item>
        <el-form-item label="赠送课时" prop="course_free">
          <el-input v-model.number="temp.course_free" type="number" />
        </el-form-item>
        <el-form-item label="总费用" prop="charge_all">
          <el-input v-model.number="temp.charge_all" type="number" />
        </el-form-item>
        <el-form-item label="已交费用" prop="charge_deli">
          <el-input v-model.number="temp.charge_deli" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchStudentsList, updateStudent, createStudent, deleteStudent, searchStudent } from '@/api/student'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Student',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        student: null
      },
      temp: {
        id: undefined,
        subject_id: '',
        student: '',
        course_all: null,
        course_left: null,
        course_used: null,
        course_free: null,
        charge_all: null,
        charge_deli: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchStudentsList().then(response => {
        console.log(response)
        const { students } = response
        this.list = students
        this.total = students.length
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      searchStudent(this.listQuery).then((response) => {
        const { students } = response
        this.total = students.length
        this.list = students
      })
    },
    handlePaginate(data) {
      this.listQuery.page = data.page
      this.listQuery.limit = data.limit
      searchStudent(this.listQuery).then((response) => {
        const { students } = response
        this.list = students
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createStudent(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateStudent(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleDelete(row, index) {
      const tempData = Object.assign({}, row)
      deleteStudent(tempData).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    }
  }
}
</script>
