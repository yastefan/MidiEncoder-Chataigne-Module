var activeEncoder = {};
var containerEncoder = local.values.addContainer("Encoder");
var containerAdd = local.parameters.addContainer("Add Enocder");
var parameterMidiChannel = containerAdd.addIntParameter("MidiChannel", "MidiChannel", 1, 1, 16);
var parameterMidiNumber = containerAdd.addIntParameter("MidiNumber", "MidiNumber", 0, 0, 127);
containerAdd.addTrigger("AddEncoder", "Add Encoder");

//Commands

function addEncoderChannel(channel, number) 
{
	var valueContainer = containerEncoder.addContainer("[" + channel + "] " + "CC" + number);
	
	valueContainer.setName("[" + channel + "] " + "CC" + number, "" + channel + "_" + number);
	valueContainer.addTrigger("Up", "triggers when turning up");//.setAttribute("readonly", true);
	valueContainer.addTrigger("Down", "triggers when turning down");//.setAttribute("readonly", true);
	valueContainer.addFloatParameter("Value", "the virtual value of the encoder", 0.5, 0, 1);
	valueContainer.addFloatParameter("Multiplicator", "the increment or decrement value", 0.5, 0, 1);
	valueContainer.addBoolParameter("Feedback", "send Feedback to midi controller?", false);

	activeEncoder["" + channel + "_" + number] = valueContainer;
}

function resetEncoders()
{
	activeEncoder = {};
	local.values.removeContainer("Encoder");
	containerEncoder = local.values.addContainer("Encoder");
}

//Events

function ccEvent(channel, number, value)
{
	var eventContainer = activeEncoder["" + channel + "_" + number];

	if(eventContainer !== undefined)
	{
		var valueObject = eventContainer.getChild("Value");
		var increment = eventContainer.getChild("Multiplicator").get() * 0.01;

		if(value == 65) 
		{
			eventContainer.getChild("Up").trigger();
			valueObject.set(valueObject.get() + increment);
		}
		else if (value == 63)
		{
			eventContainer.getChild("Down").trigger();
			valueObject.set(valueObject.get() - increment);
		}
	}
	
}

function moduleParameterChanged(param) {
	if(param.name == "addEncoder")
	{
		script.log("add new Encoder Channel: " + parameterMidiChannel.get() + " MidiNumber: " + parameterMidiNumber.get());
		addEncoderChannel(parameterMidiChannel.get(), parameterMidiNumber.get());
	}
	
}

function moduleValueChanged(value) 
{ 
	if(value.isParameter()) {
		var valueContainer = activeEncoder[value.getParent().name];
		if(valueContainer !== undefined)
		{
			if (valueContainer.getChild("Feedback").get())
			{
				var midiData = value.getParent().name.split("_");
				local.sendCC(midiData[0], midiData[1], value.get() * 127);
			}
		}
	}
} 
