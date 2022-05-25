<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.subject" placeholder="课程名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
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
      <el-table-column label="课程ID" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.subject_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.subject }}</span>
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
      <el-table-column label="状态" min-width="150px">
        <template slot-scope="{row}">
          <span> {{ row.status }} </span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handlePaginate" />

  </div>
</template>

<script>
import { fetchStudentsList, searchStudent } from '@/api/student'
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
        student: null,
        subject: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchStudentsList(this.listQuery).then(response => {
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
    }
  }
}
</script>
