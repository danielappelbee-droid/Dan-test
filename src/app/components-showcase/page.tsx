"use client";

import { useState } from "react";
import { motion, Variants } from "motion/react";
import { 
  Heart, Star, User, Mail, Phone, Calendar, Clock, MapPin, Search,
  Plus, Minus, Edit, Trash2, Download, Upload, Settings, Home
} from "lucide-react";
import { useRouter } from "next/navigation";
import AnimatedSection from "../components/AnimatedSection";
import ButtonShowcase from "../components/ButtonShowcase";
import ColorShowcase from "../components/ColorShowcase";
import AlertShowcase from "../components/AlertShowcase";
import AlertMessageShowcase from "../components/AlertMessageShowcase";
import AvatarShowcase from "../components/AvatarShowcase";
import ListItemShowcase from "../components/ListItemShowcase";
import ChipsShowcase from "../components/ChipsShowcase";
import TasksShowcase from "../components/TasksShowcase";
import FormInput from "../components/FormInput";
import CurrencyDropdown from "../components/CurrencyDropdown";
import SendReceiveInput from "../components/SendReceiveInput";
import { CheckboxGroup, RadioGroup, HorizontalRadioGroup } from "../components/CheckboxRadio";
import { SwitchGroup } from "../components/Switch";
import { SegmentedControlGroup } from "../components/SegmentedControl";
import Button from "../components/Button";
import Nudge from "../components/Nudge";
import BackButton from "../components/BackButton";

export default function HomePage() {
  const router = useRouter();
  const [textInput, setTextInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [numberInput, setNumberInput] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [checkbox2Value, setCheckbox2Value] = useState(false);
  const [radioValue, setRadioValue] = useState("");
  const [horizontalRadioValue, setHorizontalRadioValue] = useState("");
  const [segmentedValue, setSegmentedValue] = useState("option1");
  const [switchValue, setSwitchValue] = useState(false);
  const [switch2Value, setSwitch2Value] = useState(true);
  const [switch3Value, setSwitch3Value] = useState(false);
  const [rangeValue, setRangeValue] = useState(50);
  const [textareaValue, setTextareaValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [phoneValue, setPhoneValue] = useState({ countryCode: '+44', phoneNumber: '' });
  const [datePickerValue, setDatePickerValue] = useState<{ day: number | string; month: number | string; year: number | string }>({ day: '', month: '', year: '' });
  const [currencyValue, setCurrencyValue] = useState("USD");
  const [sendAmount, setSendAmount] = useState("0");
  const [sendCurrency, setSendCurrency] = useState("USD");
  const [receiveAmount, setReceiveAmount] = useState("0");
  const [receiveCurrency, setReceiveCurrency] = useState("EUR");

  const selectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" }
  ];

  const checkboxOptions = [
    { 
      label: "Option 1", 
      checked: checkboxValue, 
      onChange: setCheckboxValue 
    },
    { 
      label: "Option 2", 
      checked: checkbox2Value, 
      onChange: setCheckbox2Value 
    }
  ];

  const radioOptions = [
    { label: "Choice 1", value: "choice1" },
    { label: "Choice 2", value: "choice2" }
  ];

  const horizontalRadioOptions = [
    { label: "Option A", value: "optionA" },
    { label: "Option B", value: "optionB" }
  ];

  const segmentedOptions = [
    { label: "First", value: "option1" },
    { label: "Second", value: "option2" }
  ];

  const switchOptions = [
    { 
      label: "Enable notifications", 
      checked: switchValue, 
      onChange: setSwitchValue 
    },
    { 
      label: "Auto-save changes", 
      checked: switch2Value, 
      onChange: setSwitch2Value 
    },
    { 
      label: "Dark mode", 
      checked: switch3Value, 
      onChange: setSwitch3Value,
      disabled: false
    }
  ];

  const staggeredChildVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  const staggeredContainerVariants: Variants = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const titleVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 150,
        damping: 20
      }
    }
  };

  const buttonVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-wise-background-screen py-16 px-6">
      <BackButton href="/" />

      <div className="max-w-4xl mx-auto space-y-16">

        <motion.div
          className="text-center py-16"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="font-wise mb-4"
            style={{ fontSize: '6rem', lineHeight: '0.9' }}
            variants={titleVariants}
          >
            Components
          </motion.h1>
          <motion.p
            className="text-wise-content-secondary text-lg mb-8"
            variants={buttonVariants}
          >
            Design system components and elements
          </motion.p>
          <motion.div
            className="flex justify-center gap-2"
            variants={buttonVariants}
          >
            <Button
              variant="neutral-grey"
              size="medium"
              onClick={() => router.push('/prototypes')}
            >
              Prototypes
            </Button>
            <Button
              variant="neutral-grey"
              size="medium"
              onClick={() => router.push('/screens-list')}
            >
              Core Screens
            </Button>
          </motion.div>
        </motion.div>

        <AnimatedSection title="Typography">
          <motion.div 
            className="space-y-6"
            variants={staggeredContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h1 className="font-wise" variants={staggeredChildVariants}>Heading 1 - 4xl</motion.h1>
            <motion.h2 className="font-wise" variants={staggeredChildVariants}>Heading 2 - 3xl</motion.h2>
            <motion.h3 className="text-2xl" variants={staggeredChildVariants}>Heading 3 - 2xl</motion.h3>
            <motion.h4 className="text-xl" variants={staggeredChildVariants}>Heading 4 - xl</motion.h4>
            <motion.h5 className="text-lg" variants={staggeredChildVariants}>Heading 5 - lg</motion.h5>
            <motion.h6 className="text-base" variants={staggeredChildVariants}>Heading 6 - base</motion.h6>
            <motion.p className="text-sm" variants={staggeredChildVariants}>Small text - sm</motion.p>
            <motion.p className="text-xs" variants={staggeredChildVariants}>Extra small text - xs</motion.p>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection title="Text Colors">
          <motion.div 
            className="space-y-4"
            variants={staggeredContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p className="text-wise-content-primary" variants={staggeredChildVariants}>Primary content text</motion.p>
            <motion.p className="text-wise-content-secondary" variants={staggeredChildVariants}>Secondary content text</motion.p>
            <motion.p className="text-wise-content-tertiary" variants={staggeredChildVariants}>Tertiary content text</motion.p>
            <motion.p className="text-wise-link-content font-semibold underline" variants={staggeredChildVariants}>Link content text</motion.p>
            <motion.p className="text-wise-disabled-text" variants={staggeredChildVariants}>Disabled text</motion.p>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection title="Avatars">
          <AvatarShowcase />
        </AnimatedSection>

        <AnimatedSection title="List Items">
          <ListItemShowcase />
        </AnimatedSection>

        <AnimatedSection title="Nudge">
          <motion.div
            variants={staggeredContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={staggeredChildVariants}>
              <Nudge
                text="Transfer large amounts with expert support and guidance every step of the way"
                linkText="Learn more"
                illustration="/illos/Globe.png"
                onLinkClick={() => console.log('Nudge link clicked')}
                onClose={() => console.log('Nudge closed')}
              />
            </motion.div>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection title="Buttons">
          <ButtonShowcase />
        </AnimatedSection>

        <AnimatedSection title="Chips">
          <ChipsShowcase />
        </AnimatedSection>

        <AnimatedSection title="Tasks">
          <TasksShowcase />
        </AnimatedSection>

        <AnimatedSection title="Alert Banners">
          <AlertShowcase />
        </AnimatedSection>

        <AnimatedSection title="Alert Messages">
          <AlertMessageShowcase />
        </AnimatedSection>

        <AnimatedSection title="Form Elements">
          <motion.div 
            className="space-y-8"
            variants={staggeredContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={staggeredChildVariants}>
              <SendReceiveInput
                label="You send"
                value={sendAmount}
                onChange={setSendAmount}
                currencyValue={sendCurrency}
                onCurrencyChange={setSendCurrency}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <SendReceiveInput
                label="Recipient gets"
                value={receiveAmount}
                onChange={setReceiveAmount}
                currencyValue={receiveCurrency}
                onCurrencyChange={setReceiveCurrency}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <FormInput
                label="Text"
                type="text"
                placeholder="Enter text"
                value={textInput}
                onChange={(value) => setTextInput(value as string)}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <FormInput
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={emailInput}
                onChange={(value) => setEmailInput(value as string)}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <FormInput
                label="Password"
                type="password"
                placeholder="Enter password"
                value={passwordInput}
                onChange={(value) => setPasswordInput(value as string)}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <FormInput
                label="Phone"
                type="phone"
                placeholder="Enter phone"
                value={phoneValue}
                onChange={(value) => setPhoneValue(value as { countryCode: string; phoneNumber: string })}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <FormInput
                label="Number"
                type="number"
                placeholder="123"
                value={numberInput}
                onChange={(value) => setNumberInput(value as string)}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <FormInput
                label="Date Picker"
                type="datepicker"
                value={datePickerValue}
                onChange={(value) => setDatePickerValue(value as { day: number | string; month: number | string; year: number | string })}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <FormInput
                label="Select"
                type="select"
                placeholder="Choose"
                value={selectValue}
                onChange={(value) => setSelectValue(value as string)}
                options={selectOptions}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <CurrencyDropdown
                value={currencyValue}
                onChange={setCurrencyValue}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <FormInput
                label="Text Area"
                type="textarea"
                placeholder="Enter message"
                value={textareaValue}
                onChange={(value) => setTextareaValue(value as string)}
                rows={5}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <FormInput
                label="Slider"
                type="range"
                value={rangeValue}
                onChange={(value) => setRangeValue(value as number)}
                min={0}
                max={100}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <FormInput
                label="Upload"
                type="file"
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <FormInput
                label="Search"
                type="search"
                placeholder="Search"
                value={searchValue}
                onChange={(value) => setSearchValue(value as string)}
              />
            </motion.div>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection title="Checkboxes, Radio Buttons & Switches">
          <motion.div 
            className="space-y-8"
            variants={staggeredContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={staggeredChildVariants}>
              <CheckboxGroup
                title="Checkboxes"
                options={checkboxOptions}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <RadioGroup
                title="Radio Buttons"
                name="radioGroup"
                options={radioOptions}
                selectedValue={radioValue}
                onChange={setRadioValue}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <HorizontalRadioGroup
                title="Chip Buttons"
                name="horizontalRadioGroup"
                options={horizontalRadioOptions}
                selectedValue={horizontalRadioValue}
                onChange={setHorizontalRadioValue}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <SegmentedControlGroup
                title="Segmented Control"
                options={segmentedOptions}
                selectedValue={segmentedValue}
                onChange={setSegmentedValue}
              />
            </motion.div>

            <motion.div variants={staggeredChildVariants}>
              <SwitchGroup
                title="Switches"
                options={switchOptions}
              />
            </motion.div>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection title="Icons">
          <motion.div 
            className="grid grid-cols-6 gap-6"
            variants={staggeredContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[Heart, Star, User, Mail, Phone, Calendar, Clock, MapPin, Search, Plus, Minus, Edit, Trash2, Download, Upload, Settings, Home].map((Icon, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col items-center p-6 rounded-lg hover:bg-wise-background-neutral transition-colors" 
                style={{border: '1px solid var(--wise-interactive-secondary)'}}
                variants={staggeredChildVariants}
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-7 w-7 text-wise-content-secondary" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        <AnimatedSection title="Color Palette">
          <ColorShowcase />
        </AnimatedSection>

        <AnimatedSection title="Background Examples" withBorder={false}>
          <motion.div 
            className="space-y-6"
            variants={staggeredContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="p-6 bg-wise-background-screen rounded-lg" 
              style={{border: '1px solid var(--wise-interactive-secondary)'}}
              variants={staggeredChildVariants}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <span className="text-sm font-medium">Screen Background</span>
            </motion.div>
            <motion.div 
              className="p-6 bg-wise-background-elevated rounded-lg" 
              style={{border: '1px solid var(--wise-interactive-secondary)'}}
              variants={staggeredChildVariants}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <span className="text-sm font-medium">Elevated Background</span>
            </motion.div>
            <motion.div 
              className="p-6 bg-wise-background-neutral rounded-lg" 
              style={{border: '1px solid var(--wise-interactive-secondary)'}}
              variants={staggeredChildVariants}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <span className="text-sm font-medium">Neutral Background</span>
            </motion.div>
            <motion.div 
              className="p-6 rounded-lg" 
              style={{border: '1px solid var(--wise-interactive-secondary)', backgroundColor: 'var(--wise-disabled-background)'}}
              variants={staggeredChildVariants}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <span className="text-sm font-medium" style={{color: 'var(--wise-disabled-text)'}}>Disabled Background</span>
            </motion.div>
          </motion.div>
        </AnimatedSection>

      </div>
    </div>
  );
}