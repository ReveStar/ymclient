<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-if="role==='teacher'" v-model="listQuery.student" placeholder="学生" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-if="role==='student'" v-model="listQuery.teacher" placeholder="教练" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="课程状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in courseStatusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
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
      <el-table-column label="教练" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teacher }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地点" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.start_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150px">
        <template slot-scope="{row}">
          <span> {{ row.status }} </span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handlePaginate" />
  </div>
</template>

<script>
import { fetchCourseList, searchCourses } from '@/api/course'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'

const courseStatusOptions = ['未开始', '进行中', '已完成', '已取消']

export default {
  name: 'Home',
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
        teacher: null,
        status: ''
      },
      courseStatusOptions,
      temp: {
        id: undefined,
        subject_id: '',
        student: '',
        teacher: '',
        start_time: new Date(),
        end_time: new Date(),
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      role: ''
    }
  },
  computed: {
    ...mapGetters([
      'account_id',
      'roles'
    ])
  },
  created() {
    this.getRole()
    this.getList()
  },
  methods: {
    getRole() {
      const roles = this.roles
      if (roles.includes('student')) {
        this.role = 'student'
      } else if (roles.includes('teacher')) {
        this.role = 'teacher'
      }
    },
    getList() {
      this.listLoading = true
      this.setQuery(this.account_id)
      fetchCourseList(this.listQuery).then(response => {
        console.log(response)
        const { courses } = response
        this.list = courses
        this.total = courses.length
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      searchCourses(this.listQuery).then((response) => {
        const { courses } = response
        this.total = courses.length
        this.list = courses
      })
    },
    handlePaginate(data) {
      this.listQuery.page = data.page
      this.listQuery.limit = data.limit
      searchCourses(this.listQuery).then((response) => {
        const { courses } = response
        this.list = courses
      })
    },
    setQuery(accountId) {
      const roles = this.roles
      if (roles.includes('student')) {
        this.listQuery.student = accountId
      } else if (roles.includes('teacher')) {
        this.listQuery.teacher = accountId
      }
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: '',
        type: ''
      }
    }
  }
}
</script>
