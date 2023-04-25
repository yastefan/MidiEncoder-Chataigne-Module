# MidiEncoder-Chataigne-Module

This Chataigne module is designed to simplify the mapping of midi controllers with endless encoders.

## Example MidiFighter Twister

With the MidiFighter Twister, you can set the endless encoders to ENC 3FH/41H mode. This way, when the encoder is turned to the left, a `63 (0x3f)` is sent and when it is turned to the right, a `65 (0x41)` is sent.

The problem in Chataigne is that only values that have changed are updated. This means that a continuous rotation is only considered as an action. You can work around this problem by right-clicking on the value in the midi module in Chataigne and selecting always update.  
However, I find this workaround error-prone and cumbersome and that was the motivation for this module.

## Midi module extension

This module extends the [normal midi module](https://bkuperberg.gitbook.io/chataigne-docs/modules/protocol/midi) by the possibility to define certain midi values as endless encoders and thus to facilitate the operation of the encoders.  
**Otherwise, the midi module remains untouched, which means that it can be used as a direct replacement for the midi module.**

## Usage

Under Parameters, you can create new endless encoders by specifying the midi channel and the midi number. This creates a new container under Values, which represents the corresponding encoder. The upper two triggers fire when the encoder is turned to the left or right. **Value** can optionally be used to keep a state of the encoder in Chataigne, whereby the sensitivity of the encoder can be set via **Multiplier**.  Feedback finally serves to send the value currently held in Chatainge to the midi controller in order to get visual feedback.

## Future development

Currently, this module is primarily used for me to test encoder functions in the [grandMA3 module](https://github.com/yastefan/grandMA3-Chataigne-Module) and to become more familiar with the use of endless encoders. I think the module might be interesting for some people, but I can't test it on other midi controllers at the moment, as I only have a MidiFighter at my disposal.