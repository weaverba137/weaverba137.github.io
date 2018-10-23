###############################################################################
#
# This Makefile & all Makefiles in this product are GNU make compliant.
# Please help keep them that way.  See
# http://www.gnu.org/software/make/manual/make.html
#
###############################################################################
#
# JavaScript files to compile.
#
COFFEE_FILES := $(wildcard *.coffee)
JS_FILES := $(COFFEE_FILES:.coffee=.js)
#
# How to compile to JavaScript.
#
%.js : %.coffee
	coffee -b -c $<
#
# This should compile all code prior to it being installed
#
all : $(JS_FILES)
#
# This line helps prevent make from getting confused in the case where you
# have a file named 'all'.
#
.PHONY : all
#
# GNU make pre-defines $(RM).  The - in front of $(RM) causes make to
# ignore any errors produced by $(RM).
#
clean :
	- $(RM) *~ core
#
# This line helps prevent make from getting confused in the case where you
# have a file named 'clean'.
#
.PHONY : clean
