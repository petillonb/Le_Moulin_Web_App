const supabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0');
  async function f1(supabase:any) {
    const data = await supabase 
    .from('test')
    .select()
    return(data);   
  }

  data = f1(supabase)
  saveData = []

  checkNull(data:any){  
    if (data != null){
      return data

    }else{
      console.log("data base = null")
    }

  }
  safeData = this.checkNull(this.data)




