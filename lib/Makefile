###############################################################################
#
# This Makefile & all Makefiles in this product are GNU make compliant.
# Please help keep them that way.  See
# http://www.gnu.org/software/make/manual/make.html
#
###############################################################################
#
# This should compile all code prior to it being installed
#
all : hashes.json
#
# This line helps prevent make from getting confused in the case where you
# have a file named 'all'.
#
.PHONY : all
#
#
#
hashes.json : hashes.csv
	python2.7 hashes.py $<
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
