import { useRef, useState, useEffect} from 'react';
import axios from "axios";

import { Typography, Table, Button, Input, Space } from "antd"
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';

import LayoutAdmin from "../Layout/LayoutAdmin"


const Transport = () => {

  const [data, setData] = useState([])     

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  useEffect(() => {
    axios.get("http://localhost:5000/player", config)   
      .then((res) => {
        setData(res.data)  
      })
      .catch(err=> {
        console.log(err);
      })
  }, [])

  const resfresh = () => {       
    axios.get("http://localhost:5000/player", config)
      .then((res) => {
        setData([])
        setData(res.data)
      })
      .catch(err=> {
        console.log(err);
      })
  }

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({  
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}   //lấy ra dữ liệu từ input để lọc
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}   //bắt sự kiện lọc
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
              backgroundColor: 'blue'
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}  //reset bộ lọc
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [ 
    {
      title: 'Mã thẻ',
      dataIndex: 'key',
      key: 'key'
    },
    {
      title: 'Thời gian vào',
      dataIndex: 'timeIn',
      key: 'timeIn',
      ...getColumnSearchProps('timeIn')
    },
    {
      title: 'Cân nặng',
      dataIndex: 'weight',
      key: 'weight'
    },
    {
      title: 'Chiều cao',
      dataIndex: 'height',
      key: 'height'
    },
  ]

  return (
    <LayoutAdmin>
        <div className='flex justify-between'>
          <Typography.Title level={5}>Quản lý Người chơi</Typography.Title>
          <div onClick={resfresh} className='flex gap-1 cursor-pointer'>
            <CachedOutlinedIcon/>
            <p>Refresh</p>
          </div>
        </div>
        <Table columns={columns} dataSource={data}/>
    </LayoutAdmin>
  )
}

export default Transport