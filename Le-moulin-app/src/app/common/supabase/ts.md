async fetchEventDataById(id: number): Promise<EventActivite> {
    const eventQuery = await this.supabase
    .from('event')
    .select()
    .eq('id',id)
  type EventData = QueryData<typeof eventQuery>

  const { data, error } = await eventQuery
  if (error) throw error
  const eventData: EventData = data as EventData

  return (eventData[0]  as EventActivite);
  }