<template>
  <div class="app-container">
    <div class="navbar">
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
      >
        <el-menu-item index="1">所有课程</el-menu-item>
      </el-menu>
      <el-divider />
    </div>
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
      <el-table-column label="操作" align="center" min-width="100px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="handleClick(row,$index)">
            报名
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="课程名" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程价格" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="团购价格" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.discount_price }}</span>
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
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handlePaginate" />

  </div>
</template>

<script>
import { fetchSubjectList, searchSubjects } from '@/api/subject'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Subjects',
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
        console.log(response)
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
      this.$router.push({ path: '/index' })
    }
  }
}
</script>
