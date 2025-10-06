# 我的项目

在这里，您可以自由地使用 Markdown 语法来展示您的项目列表。

---

### 项目一：电商核心交易系统
**描述：** 参与设计和开发了公司核心电商平台的高并发交易系统。
- **技术栈：** `Java`, `Spring Boot`, `Redis`, `RocketMQ`

**示例代码:**
``` javascript
// 核心交易逻辑伪代码
async function processOrder(order) {
  try {
    const stockReserved = await reserveStock(order.items);
    if (stockReserved) {
      const paymentSuccess = await processPayment(order.paymentInfo);
      if (paymentSuccess) {
        // ...创建订单，发送消息等
        return { success: true, orderId: '...' };
      }
    }
  } catch (error) {
    console.error('交易失败:', error);
    // ...回滚库存等补偿操作
    return { success: false, error: '交易失败' };
  }
}
```

### 项目二：个人开源项目
**描述：** 一个帮助开发者在终端快速管理和搜索代码片段的命令行工具。
``` go
// Go 语言示例
package main

import "fmt"

func main() {
    fmt.Println("Hello, highlight.js!")
}
```