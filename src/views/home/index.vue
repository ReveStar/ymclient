<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-if="role==='teacher'" v-model="listQuery.student" placeholder="学生" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-if="role==='student'" v-model="listQuery.teacher" placeholder="教练" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="课程状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in courseStatusOptions" :key="item" :label="item" :value="item" />
      </el-select>
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
      <el-table-column label="课程名" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.subject }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程ID" align="center" width="100">
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
      <el-table-column v-if="role==='teacher'" label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row, $index)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handlePaginate" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="课程名" prop="subject">
          <el-input v-model="temp.subject" :disabled="true" />
        </el-form-item>
        <el-form-item label="学生" prop="student">
          <el-input v-model="temp.student" :disabled="true" />
        </el-form-item>
        <el-form-item label="教练" prop="teacher">
          <el-select v-model="temp.teacher_id" placeholder="选择教师" @change="handleSelectTeacher(temp.teacher_id)">
            <el-option v-for="item in teacherList" :key="item.account_id" :label="item.username" :value="item.account_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="地点" prop="location">
          <el-input v-model="temp.location" :disabled="true" />
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker v-model="temp.start_time" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker v-model="temp.end_time" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in courseStatusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchCourseList, searchCourses, updateCourse } from '@/api/course'
import { getTeachers } from '@/api/user'
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
      teacherList: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        student: null,
        teacher: null,
        status: '',
        teacher_id: '',
        student_id: ''
      },
      courseStatusOptions,
      temp: {
        id: undefined,
        subject: '',
        subject_id: '',
        student: '',
        student_id: '',
        teacher: '',
        teacher_id: '',
        start_time: new Date(),
        end_time: new Date(),
        status: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑'
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
    this.getTeacherAccounts()
    this.getList()
  },
  methods: {
    getRole() {
      const roles = this.roles
      if (roles.includes('student')) {
        this.role = 'student'
        this.listQuery.student_id = this.account_id
      } else if (roles.includes('teacher')) {
        this.role = 'teacher'
        this.listQuery.teacher_id = this.account_id
      }
    },
    getList() {
      this.listLoading = true
      fetchCourseList(this.listQuery).then(response => {
        console.log(response)
        const { courses } = response
        this.list = courses
        this.total = courses.length
        this.listLoading = false
      })
    },
    getTeacherAccounts() {
      getTeachers().then(response => {
        const { teachers } = response
        this.teacherList = teachers
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
    resetTemp() {
      this.temp = {
        id: undefined,
        subject: '',
        subject_id: '',
        student: '',
        student_id: '',
        teacher: '',
        teacher_id: '',
        start_time: new Date(),
        end_time: new Date(),
        status: ''
      }
    },
    handleSelectTeacher(teacherId) {
      this.teacherList.forEach(element => {
        if (element.account_id === teacherId) {
          this.temp.teacher = element.username
        }
      })
    },
    handleUpdate(row, index) {
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
          updateCourse(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '已更新',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    }
  }
}
</script>
