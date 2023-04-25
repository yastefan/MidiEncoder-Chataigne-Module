function loadEncoderObject()
{
	var objectEncoder = {};
	var namesEncoder = util.getObjectProperties(local.values.getChild("Encoder"), true, false);
	for (var index = 0; index < namesEncoder.length; index++)
	{
		var midiData = namesEncoder[index].split("_");
		script.log(midiData);
		createEncoderContainer(midiData[0], midiData[1]);
		objectEncoder[namesEncoder[index]] = local.values.getChild("Encoder").getChild(namesEncoder[index]);
	}
	return objectEncoder;
}

//Commands

function addEncoderChannel(channel, number) 
{
	activeEncoder["" + channel + "_" + number] = createEncoderContainer(channel, number);
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
		var midiChannel = local.parameters.getChild("AddEncoder").getChild("MidiChannel").get();
		var midiNumber = local.parameters.getChild("AddEncoder").getChild("MidiNumber").get();

		script.log("add new Encoder Channel: " +  midiChannel + " MidiNumber: " + midiNumber);
		addEncoderChannel(midiChannel, midiNumber);
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

function createEncoderContainer(channel, number) 
{
	var valueContainer = local.values.getChild("Encoder").addContainer("" + channel + "_" + number);
	
	//valueContainer.setName("[" + channel + "] " + "CC" + number, "" + channel + "_" + number);
	valueContainer.addTrigger("Up", "triggers when turning up");
	valueContainer.addTrigger("Down", "triggers when turning down");
	valueContainer.addFloatParameter("Value", "the virtual value of the encoder", 0.5, 0, 1);
	valueContainer.addFloatParameter("Multiplicator", "the increment or decrement value", 0.5, 0, 1);
	valueContainer.addBoolParameter("Feedback", "send Feedback to midi controller?", false);

	return valueContainer;
}

var activeEncoder = loadEncoderObject();