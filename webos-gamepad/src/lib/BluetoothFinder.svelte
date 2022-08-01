<script lang="ts">
import '@procot/webostv'

let logs = []
const log = (str: string, data?:any) => {
  const oldLogs = logs.length < 10 ? logs : logs.slice(1)
  logs = [...oldLogs, `${str} [${data ? `${JSON.stringify(data, null, 2)}` : ''}]`]

  console.log(`[LOG] ${str}`, data) 
}

try{
  let devices = null
  log("this", this)
  log("Sub devices")
  const request = webOS.service.request("luna://com.webos.service.bluetooth2", {
    method:"device/getStatus",
    parameters: {
      subscribe: true
    },
    onSuccess:function (args) {
      console.log("proutos")
      log("success", args)
    },
    onFailure:function (inError) {
      console.log("failos")

      log("fail", inError)
    }, 
    onComplete: function(inResponse) {
      console.log("completos")

      log("complete", inResponse)
    },
    subscribe: true,
})
  
  log("got subscription", request)
} catch(e) {
  log('error', {error: e.toString(), stack: e.stack})
}
let devices = []

function search() {
    log(`gogo seraching`)
  const issEarching = webOS.service.request(
    'luna://com.webos.service.bluetooth2',
    { method: 'adapter/startDiscovery' }
  )
    log(`got `, issEarching)

  
}


function callSystemService() {
  webOS.service.request('luna://com.palm.systemservice',
    {
      method: 'time/getSystemTime',
      parameters: { subscribe: true },
      onSuccess: function (res) {
        console.log('system time suc', res);
      },
      onFailure: function (res) {
        console.log('system time fail', res);
      },
      subscribe: true,
    }
  );
}

callSystemService()
</script>

<div class="finder">


  <pre style="background:white; color:black">
    {JSON.stringify(devices, null, 2)}
  </pre>

  <button on:click={search}>Click to search</button>

  
  <pre style="background:white; color:black">
    {JSON.stringify(logs, null, 2)}
  </pre>

</div>