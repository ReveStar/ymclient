<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="课程名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
    </div> -->

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
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="课程ID" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.subject_id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="学费" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课时数" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.school_hour }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.describ }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="handleClick(row,$index)">
            报名
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handlePaginate" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="课程名" prop="name">
          <el-input v-model="temp.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="课程ID" prop="subject_id">
          <el-input v-model="temp.subject_id" :disabled="true" />
        </el-form-item>
        <el-form-item label="学费" prop="price">
          <el-input v-model="temp.price" :disabled="true" />
        </el-form-item>
        <el-form-item label="课时数" prop="school_hour">
          <el-input-number v-model="temp.school_hour" :disabled="true" />
        </el-form-item>
        <el-form-item label="介绍" prop="describ">
          <el-input v-model="temp.describ" :disabled="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleOrderSubject">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchSubjectList, searchSubjects, orderSubject } from '@/api/subject'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Message } from 'element-ui'

export default {
  name: 'Subject',
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
        name: ''
      },
      temp: {
        id: undefined,
        name: '',
        subject_id: '',
        price: null,
        school_hour: null,
        describ: ''
      },
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        click: '报名'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchSubjectList().then(response => {
        const { subjects } = response
        this.list = subjects
        this.total = subjects.length
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      searchSubjects(this.listQuery).then((response) => {
        const { subjects } = response
        this.total = subjects.length
        this.list = subjects
      })
    },
    handlePaginate(data) {
      this.listQuery.page = data.page
      this.listQuery.limit = data.limit
      searchSubjects(this.listQuery).then((response) => {
        const { subjects } = response
        this.list = subjects
      })
    },
    handleClick(row, index) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'click'
      this.dialogFormVisible = true
    },
    handleOrderSubject() {
      orderSubject(this.temp).then((response) => {
        const { success } = response
        if (success === true) {
          Message({
            message: '报名信息已提交',
            type: 'info',
            duration: 5 * 1000
          })
        }
      })
    }
  }
}
</script>
